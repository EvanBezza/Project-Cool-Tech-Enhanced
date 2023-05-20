const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'normal' },
    OUs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OU' }],
    divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }],
});

module.exports = mongoose.model('User', UserSchema);
