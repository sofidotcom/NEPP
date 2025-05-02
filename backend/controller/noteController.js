const Note = require('../model/noteModel');
const RecentActivity = require('../model/recentActivityModel');

exports.createNote = async (req, res) => {
  try {
    const { title, description, subject, grade, chapter } = req.body;
    const teacherId = req.user?.userId; // ✅ Extract creator from token

    if (!teacherId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user token' });
    }

    const newNote = new Note({
      title,
      description,
      subject,
      grade,
      chapter,
      createdBy: teacherId // ✅ Set creator
    });

    const savedNote = await newNote.save();

    // Save recent activity
    const activity = new RecentActivity({
      teacherId: teacherId,
      activityType: 'note_added',
      description: `Added a new note: "${title}" for ${subject} (Grade ${grade})`,
      resourceId: savedNote._id,
    });

    await activity.save();

    res.status(201).json({ message: 'Note created successfully', note: savedNote });
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};
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
