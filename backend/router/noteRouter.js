const express = require('express');
const noteController = require('../controller/noteController');
const verifyToken = require('../middleware/authMiddleware'); // ✅ Import middleware
const router = express.Router();

router.post('/', verifyToken, noteController.createNote);  // ✅ Add token check
router.get('/', noteController.getAllNotes);

module.exports = router;
