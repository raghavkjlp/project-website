// require('dotenv').config();
// const express = require('express');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const morgan = require('morgan');
// const cors = require('cors');
// const path = require('path');

// const connectDB = require('./config/db');

// const authRoutes = require('./routes/auth');
// const studentRoutes = require('./routes/students');
// const donationRoutes = require('./routes/donations');
// const adminRoutes = require('./routes/admin');
// const paymentRoutes = require('./routes/payment');

// const app = express();
// connectDB();

// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));

// const limiter = rateLimit({ windowMs: 1*60*1000, max: 100 });
// app.use(limiter);

// app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// app.use('/api/auth', authRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/donations', donationRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/payment', paymentRoutes);

// app.get('/', (req, res) => res.send({ ok: true, env: process.env.NODE_ENV || 'dev' }));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ Try DB connection only if URI exists
if (process.env.MONGO_URI) {
  const connectDB = require('./config/db');
  connectDB();
} else {
  console.log("⚠️ MongoDB not configured. Running in mock mode.");
}

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const donationRoutes = require('./routes/donations');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 1*60*1000, max: 100 });
app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// ✅ Comment out real routes if DB is missing
if (process.env.MONGO_URI) {
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/donations', donationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payment', paymentRoutes);
}

// ✅ Always available test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working 🚀 (mock mode)" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
