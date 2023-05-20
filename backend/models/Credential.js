// Credential.js
const mongoose = require('mongoose')

const CredentialSchema = new mongoose.Schema({
  username: String,
  password: String,
  target: String,
})

module.exports = mongoose.model('Credential', CredentialSchema)
