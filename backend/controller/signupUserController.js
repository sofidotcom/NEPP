const studentModel = require('../model/signupUserModel');

const signupController = async (req, res) => {
    try {
        // Check if the email already exists
        const existing = await studentModel.findOne({ email: req.body.email });
        if (existing) {
            return res.status(400).json({ // Change status to 400 for client error
                errors: {
                    email: {
                        message: "Email already exists"
                    }
                }
            });
        }

        // Create a new student record
        const role = req.body.role || 'student';
        const newStudent = new studentModel({ ...req.body, role });
        await newStudent.save();
        
        res.status(201).json({
            message: 'Student registered successfully',
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (const field in error.errors) {
                validationErrors[field] = {
                    message: error.errors[field].message
                };
            }
            return res.status(400).json({ errors: validationErrors });
        }
        
        // Handle other errors
        res.status(500).json({
            message: 'The process has failed',
            success: false
        });
    }
};

module.exports = signupController; // 