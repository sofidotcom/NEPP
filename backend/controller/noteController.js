const Note = require('../model/noteModel');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, description, subject, chapter } = req.body;
    const newNote = new Note({ title, description, subject, chapter });
    await newNote.save();
    res.status(201).json({ message: 'Note created successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const { subject } = req.query;
    const query = subject ? { subject } : {};
    const notes = await Note.find(query);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};;