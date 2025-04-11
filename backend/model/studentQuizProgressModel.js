const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    subjectProgress: {
        type: Map,
        of: [Number],
        default: () => ({
            Biology: [1] // Default to level 1 unlocked
        })
    }
});

module.exports = mongoose.model('StudentProgress', studentProgressSchema);