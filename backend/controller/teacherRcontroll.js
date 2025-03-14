const TeacherModel = require('../model/teacherRegisterModel');

const signupTeacher = async (req, res) => {
    try {
        const { fullName, email, password, subject } = req.body;

        // Check if the email already exists
        const existing = await TeacherModel.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newTeacher = new TeacherModel({
            fullName,
            email,
            password,
            subject,
        });

        await newTeacher.save();
        res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering teacher', error });
    }
};
module.exports=signupTeacher;