const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  mood: { type: String, required: true },
  date: { type: String, required: true },
  timestamp: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Mood', MoodSchema);
