const express = require('express');
const noteController = require('../controller/noteController');
const router = express.Router();
// Route to create a new note
router.post('/', noteController.createNote);

// Route to get all notes
router.get('/', noteController.getAllNotes);

module.exports = router;