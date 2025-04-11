const Note = require('../model/noteModel');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, description, subject, grade, chapter } = req.body;
    const newNote = new Note({ title, description, subject, grade, chapter });
    await newNote.save();
    res.status(201).json({ message: 'Note created successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

// Get all notes with filtering by subject and grade
exports.getAllNotes = async (req, res) => {
  try {
    const { subject, grade } = req.query;
    const query = {};
    
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    
    const notes = await Note.find(query);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};