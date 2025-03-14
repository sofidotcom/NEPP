const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be filled']
    },
    email: {
        type: String,
        required: [true, 'Email must be filled'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password must be filled']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number must be filled'],
        match: /^09\d{8}$/ // Ensures 10 digits, starting with '09'
    },
    role: {
        type: String,
        enum: ['student', 'super_admin'],
        default: 'student'
    }
});

const StudentModel = mongoose.model('students', studentSchema);
module.exports = StudentModel;