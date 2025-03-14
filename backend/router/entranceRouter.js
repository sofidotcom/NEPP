const express = require('express');
const router = express.Router();
const entranceController = require('../controller/entranceController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig'); // ⬅️ Handles file uploads!

// POST: create entrance with images support
router.post(
  '/bioEntrance',
  verifyToken,
  upload.fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'options[0][image]', maxCount: 1 },
    { name: 'options[1][image]', maxCount: 1 },
    { name: 'options[2][image]', maxCount: 1 },
    { name: 'options[3][image]', maxCount: 1 },
  ]),
  entranceController.createEntrance
);

// GET: fetch entrance exams by year
router.get('/bioEntrance/:year', entranceController.getEntrance);

module.exports = router;

