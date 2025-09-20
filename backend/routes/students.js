const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, restrictTo } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.get('/', protect, restrictTo('admin', 'verifier'), studentController.getAll);
router.get('/:id', protect, restrictTo('admin', 'verifier', 'student'), studentController.getById);
router.put('/:id/scores', protect, restrictTo('admin', 'verifier'), studentController.updateScores);
router.post('/:id/calculate', protect, restrictTo('admin', 'verifier'), studentController.calculateFinal);
router.post('/:id/upload', protect, restrictTo('student', 'admin', 'verifier'), upload.array('documents', 5), studentController.uploadDocs);

module.exports = router;
