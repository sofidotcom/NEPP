const mongoose = require('mongoose');
const addExam = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    level: { type: Number, required: true, default: 1 },
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
});
const addExamModel = mongoose.model('biologyExam', addExam);
module.exports = addExamModel;