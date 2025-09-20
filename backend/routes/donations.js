const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const donationController = require('../controllers/donationController');

router.post('/', protect, donationController.create);
router.get('/', protect, donationController.all);

module.exports = router;
