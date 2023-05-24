// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: OrganissationalUnits.js

const mongoose = require('mongoose')

// Define the OUSchema using the Mongoose Schema class
const OUSchema = new mongoose.Schema({
  name: String, // Name field
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }], // Array of Division references
})

// Create and export the OU model using the OUSchema
module.exports = mongoose.model('OU', OUSchema)
