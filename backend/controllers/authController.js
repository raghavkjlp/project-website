const User = require('../models/User');
// const student = require('../models/Student'); // Make sure Student model exists
// const  = require('../models/Donation');    
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role,Program,donationAmount } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
    if (!['student', 'donor'].includes(role)) return res.status(400).json({ error: 'Cannot self-register for this role' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    // if (role === 'student') {
    //   const Student = require('../models/Student');
    //   await Student.create({ user: user._id, name });
    // }

if (role === 'student') {
  const Student = require('../models/Student');
  const files = req.files ? req.files.map(f => f.path) : [];
  await Student.create({
    user: user._id,
    name,
    documents: req.body.documents || []
  });
}




    const token = signToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
