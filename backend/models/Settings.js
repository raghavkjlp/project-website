const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  weightExam1: { type: Number, default: 0.25 },
  weightExam2: { type: Number, default: 0.25 },
  weightCV: { type: Number, default: 0.25 },
  weightInterview: { type: Number, default: 0.25 },
  cutoff: { type: Number, default: 150 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
