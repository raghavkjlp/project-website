
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'donor', 'admin', 'verifier'], required: true },
  Program: { type: String }, 
  donationAmount: { type: Number },
  documents: [{ 
    filename: String, 
    url: String, 
    uploadedAt: { type: Date, default: Date.now } 
  }], // optional array for uploaded documents
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);


