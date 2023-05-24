// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: Divisions.js

const mongoose = require('mongoose')

// Define the DivisionSchema using the Mongoose Schema class
const DivisionSchema = new mongoose.Schema({
  name: String, // Name field
  credentialRepository: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Credential' },
  ], // Array of Credential references
})

// Create and export the Division model using the DivisionSchema
module.exports = mongoose.model('Division', DivisionSchema)
