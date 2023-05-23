const jwt = require('jsonwebtoken')
const User = require('../models/User')
const OU = require('../models/OrganizationalUnits')
const Division = require('../models/Divisions')
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username, password })
  if (user) {
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        OUs: user.OUs,
        divisions: user.divisions,
      },
      process.env.SECRET_KEY,
    )
    res.json({ token })
  } else {
    res.status(401).json({ error: 'Invalid username or password' })
  }
}

exports.register = async (req, res) => {
  const { username, password } = req.body
  const userExists = await User.findOne({ username })
  if (userExists) {
    res.status(400).json({ error: 'Username already exists' })
  } else {
    const user = new User({ username, password })
    await user.save()
    res.status(201).json({ message: 'User created successfully' })
  }
}

exports.getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId)
    .populate('OUs')
    .populate('divisions')
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'User not found' })
  }
}

exports.addOU = async (req, res) => {
  const { name } = req.body
  const ou = new OU({ name })
  await ou.save()
  res.status(201).json({ message: 'OU created successfully' })
}

exports.addDivision = async (req, res) => {
  const { name, ouId } = req.body
  const division = new Division({ name })
  await division.save()

  // Add division to the specified OU
  const ou = await OU.findById(ouId)
  if (!ou) {
    return res.status(404).json({ message: 'OU not found' })
  }
  ou.divisions.push(division._id)
  await ou.save()

  res.status(201).json({ message: 'Division created successfully' })
}

exports.assignUserToOU = async (req, res) => {
  const { userId, ouId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const ou = await OU.findById(ouId);
  if (!ou) {
    return res.status(404).json({ message: 'OU not found' });
  }

  if (user.OUs.indexOf(ouId) === -1) {
    user.OUs.push(ouId);
    await user.save();
  }

  res.status(200).json({ message: 'User assigned to OU successfully' });
};

exports.removeUserFromOU = async (req, res) => {
  const { userId, ouId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const ouIndex = user.OUs.indexOf(ouId);
  if (ouIndex === -1) {
    return res.status(400).json({ message: 'User is not assigned to the OU' });
  }

  user.OUs.splice(ouIndex, 1);
  await user.save();

  res.status(200).json({ message: 'User removed from OU successfully' });
};

exports.getOUs = async (req, res) => {
  try {
    const ous = await OU.find();
    res.status(200).json(ous);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.assignUserToDivision = async (req, res) => {
  const { userId, divisionId } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const division = await Division.findById(divisionId)
    if (!division) {
      return res.status(404).json({ message: 'Division not found' })
    }

    if (!user.divisions.includes(divisionId)) {
      user.divisions.push(divisionId)
      await user.save()
    }

    res.status(200).json({ message: 'User assigned to division successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

exports.removeUserFromDivision = async (req, res) => {
  const { userId, divisionId } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Convert divisionId to ObjectId before filtering.
    const ObjectId = require('mongoose').Types.ObjectId
    const divisionObjectId = new ObjectId(divisionId)

    if (user.divisions.includes(divisionObjectId)) {
      user.divisions = user.divisions.filter(
        (division) => !division.equals(divisionObjectId),
      )
      await user.save()
    }

    res.status(200).json({ message: 'User removed from division successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

exports.assignDivisionToOU = async (req, res) => {
  const { ouId, divisionId } = req.body

  const ou = await OU.findById(ouId)
  if (!ou) {
    return res.status(404).json({ message: 'OU not found' })
  }

  const division = await Division.findById(divisionId)
  if (!division) {
    return res.status(404).json({ message: 'Division not found' })
  }

  if (ou.divisions.indexOf(divisionId) === -1) {
    ou.divisions.push(divisionId)
    await ou.save()
  }

  res.status(200).json({ message: 'Division assigned to OU successfully' })
}

exports.getOU = async (req, res) => {
  const ou = await OU.findById(req.params.ouId).populate('divisions')
  if (ou) {
    res.json(ou)
  } else {
    res.status(404).json({ error: 'OU not found' })
  }
}

const Credential = require('../models/Credential') // import the Credential model

exports.getCredentialsForDivision = async (req, res) => {
  const { divisionId } = req.params

  const division = await Division.findById(divisionId).populate(
    'credentialRepository',
  )
  if (!division) {
    return res.status(404).json({ error: 'Division not found' })
  }

  res.json(division.credentialRepository)
}

exports.addCredentialToDivision = async (req, res) => {
  const { divisionId } = req.params
  const { username, password, target } = req.body

  const division = await Division.findById(divisionId)
  if (!division) {
    return res.status(404).json({ error: 'Division not found' })
  }

  const credential = new Credential({ username, password, target })
  await credential.save()

  division.credentialRepository.push(credential._id)
  await division.save()

  res.status(201).json({ message: 'Credential added successfully' })
}

exports.updateCredential = async (req, res) => {
  const { credentialId } = req.params
  const { username, password, target } = req.body
  console.log(credentialId)
  console.log(username)
  console.log(password)
  console.log(target)

  const credential = await Credential.findById(credentialId)
  if (!credential) {
    return res.status(404).json({ error: 'Credential not found' })
  }
  console.log(credential)

  credential.username = username || credential.username
  credential.password = password || credential.password
  credential.target = target || credential.target

  await credential.save()

  res.status(200).json({ message: 'Credential updated successfully' })
}

exports.getDivisions = async (req, res) => {
  try {
    const divisions = await Division.find()
    res.json(divisions)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

exports.getCredentials = async (req, res) => {
  const credentials = await Credential.find()
  res.json(credentials)
}

exports.getUsers = async (req, res) => {
  const users = await User.find()
  res.json(users)
}

exports.changeUserRole = async (req, res) => {
  const { userId } = req.params
  const { role } = req.body

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  user.role = role
  await user.save()

  res.status(200).json({ message: 'User role changed successfully' })
}
