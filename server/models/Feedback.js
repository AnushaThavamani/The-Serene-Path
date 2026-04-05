const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userEmail: { type: String, default: '' },
  userName: { type: String, default: 'Anonymous' },
  subject: { type: String, default: 'General feedback' },
  category: {
    type: String,
    enum: ['general', 'bug', 'feature', 'experience', 'journal', 'mood', 'bibliotherapy', 'multimedia', 'regulation', 'other'],
    default: 'general',
  },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
