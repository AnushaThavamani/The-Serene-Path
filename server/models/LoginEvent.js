const mongoose = require('mongoose');

const LoginEventSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  fullName: { type: String, default: '' },
  role: { type: String, default: 'user' },
  loggedInAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('LoginEvent', LoginEventSchema);
