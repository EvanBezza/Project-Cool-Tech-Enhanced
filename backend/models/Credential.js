// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: Credentials.js

const mongoose = require('mongoose')

// Define the CredentialSchema using the Mongoose Schema class
const CredentialSchema = new mongoose.Schema({
  username: String, // Username field
  password: String, // Password field
  target: String, // Target field
})

// Create and export the Credential model using the CredentialSchema
module.exports = mongoose.model('Credential', CredentialSchema)
