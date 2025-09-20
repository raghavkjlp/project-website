const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  program: { type: String },
  year: { type: Number },
  exam1: { type: Number, default: 0 },
  exam2: { type: Number, default: 0 },
  cvScore: { type: Number, default: 0 },
  interview: { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Shortlisted', 'Selected', 'Not Selected'], default: 'Pending' },
  documents: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
