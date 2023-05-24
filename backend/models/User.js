// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: User.js

const mongoose = require('mongoose')

// Define the UserSchema using the Mongoose Schema class
const UserSchema = new mongoose.Schema({
  username: String, // Username field
  password: String, // Password field
  role: { type: String, default: 'normal' }, // Role field with default value 'normal'
  OUs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OU' }], // Array of OU references
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }], // Array of Division references
})

// Create and export the User model using the UserSchema
module.exports = mongoose.model('User', UserSchema)
