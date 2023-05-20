// Division.js
const mongoose = require('mongoose');

const DivisionSchema = new mongoose.Schema({
  name: String,
  credentialRepository: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Credential' }],
});

module.exports = mongoose.model('Division', DivisionSchema);
