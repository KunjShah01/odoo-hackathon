const express = require('express');
const router = express.Router();
const ocrController = require('../controllers/ocrController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST /api/ocr/extract
router.post('/extract', auth, upload.single('receipt'), ocrController.extractText);

module.exports = router;