// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: UserController.js

const jwt = require('jsonwebtoken') // Import the jwt module
const User = require('../models/User') // Import the User model
const OU = require('../models/OrganisationalUnits') // Import the OU model
const Division = require('../models/Divisions') // Import the Division model

// ------------------------------------------
// Credential Management Related Controllers:
// ------------------------------------------
const Credential = require('../models/Credential') // Import the Credential model
// Update credential route handler
exports.updateCredential = async (req, res) => {
  const { credentialId } = req.params
  const { username, password, target } = req.body

  const credential = await Credential.findById(credentialId)
  if (!credential) {
    return res.status(404).json({ error: 'Credential not found' })
  }

  credential.username = username || credential.username
  credential.password = password || credential.password
  credential.target = target || credential.target

  await credential.save()

  res.status(200).json({ message: 'Credential updated successfully' })
}
// Add credential to a division route handler
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
// Get credentials for a division route handler
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
// Get all credentials route handler
exports.getCredentials = async (req, res) => {
  const credentials = await Credential.find()
  res.json(credentials)
}

// ----------------------------------------
// Division Management Related Controllers:
// ----------------------------------------
// Get all divisions route handler
exports.getDivisions = async (req, res) => {
  try {
    const divisions = await Division.find()
    res.json(divisions)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
// Assign Division to OU route handler
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
// Assign User to Division route handler
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
// Remove User from Division route handler
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
// Add Division route handler
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

// ----------------------------------
// OU Management Related Controllers:
// ----------------------------------
// Add OU route handler
exports.addOU = async (req, res) => {
  const { name } = req.body
  const ou = new OU({ name })
  await ou.save()
  res.status(201).json({ message: 'OU created successfully' })
}
// Assign User to OU route handler
exports.assignUserToOU = async (req, res) => {
  const { userId, ouId } = req.body

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const ou = await OU.findById(ouId)
  if (!ou) {
    return res.status(404).json({ message: 'OU not found' })
  }

  if (user.OUs.indexOf(ouId) === -1) {
    user.OUs.push(ouId)
    await user.save()
  }

  res.status(200).json({ message: 'User assigned to OU successfully' })
}
// Remove User from OU route handler
exports.removeUserFromOU = async (req, res) => {
  const { userId, ouId } = req.body

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const ouIndex = user.OUs.indexOf(ouId)
  if (ouIndex === -1) {
    return res.status(400).json({ message: 'User is not assigned to the OU' })
  }

  user.OUs.splice(ouIndex, 1)
  await user.save()

  res.status(200).json({ message: 'User removed from OU successfully' })
}
// Get all OUs route handler
exports.getOUs = async (req, res) => {
  try {
    const ous = await OU.find()
    res.status(200).json(ous)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ------------------------------------
// User Management Related Controllers:
// ------------------------------------
// Login route handler
exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username, password })
  if (user) {
    // Generate a JWT token
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
// Register route handler
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
// Get all users route handler
exports.getUsers = async (req, res) => {
  const users = await User.find()
  res.json(users)
}
// Change user role route handler
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
