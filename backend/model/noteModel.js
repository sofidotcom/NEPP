const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  grade: { type: String, required: true, enum: ['9', '10', '11', '12'] },
  chapter: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', noteSchema);