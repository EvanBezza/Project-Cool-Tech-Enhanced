// OrganizationalUnits.js
const mongoose = require('mongoose')

const OUSchema = new mongoose.Schema({
  name: String,
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }],
})

module.exports = mongoose.model('OU', OUSchema)
