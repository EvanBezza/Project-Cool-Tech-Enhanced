const jwt = require('jsonwebtoken')
const User = require('../models/User')
const OU = require('../models/OrganizationalUnits')
const Division = require('../models/Divisions')

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

exports.assignUserToDivision = async (req, res) => {
  const { userId, divisionId } = req.body

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const division = await Division.findById(divisionId)
  if (!division) {
    return res.status(404).json({ message: 'Division not found' })
  }

  if (user.divisions.indexOf(divisionId) === -1) {
    user.divisions.push(divisionId)
    await user.save()
  }

  res.status(200).json({ message: 'User assigned to Division successfully' })
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
