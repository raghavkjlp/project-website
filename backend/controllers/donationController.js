const Donation = require('../models/Donation');
const User = require('../models/User');
const generateInvoice = require('../utils/invoice');

exports.create = async (req, res) => {
  try {
    const { name, email, amount, method } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount required' });

    const donation = await Donation.create({
      donor: req.user ? req.user._id : null,
      name: name || (req.user && req.user.name) || 'Guest',
      email: email || (req.user && req.user.email) || '',
      amount: Number(amount),
      method: method || 'unknown',
      receiptId: `RUP-${Date.now()}`
    });

    // generate PDF receipt
    const invoicePath = generateInvoice(donation, req.user || { name: donation.name, email: donation.email });
    donation.receiptPath = invoicePath;
    await donation.save();

    res.json({ message: 'Donation saved (simulate payment)', donation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.all = async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor', 'name email');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
