const addExamModel = require('../model/addExamModel');

exports.addQuize = async (req, res) => {
    try {
        // Validate required fields
        const { subject, level, question, options, correctAnswer, explanation } = req.body;
        
        if (!subject || !question || !options || !correctAnswer) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newQuestion = new addExamModel({
            subject,
            level: level || 1, // Default to level 1 if not specified
            question,
            options,
            correctAnswer,
            explanation: explanation || '' // Optional field
        });

        await newQuestion.save();
        res.status(201).json({ 
            success: true,
            message: "Question added successfully",
            data: newQuestion
        });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to add question', 
            error: error.message 
        });
    }
};

exports.getQuize = async (req, res) => {
    try {
        const { subject, groupByLevel, level } = req.query;
        let query = {};
        
        // Build query based on parameters
        if (subject) {
            // Case-insensitive subject search
            query.subject = { $regex: new RegExp(`^${subject}$`, 'i') };
        }
        if (level) {
            query.level = parseInt(level, 10); // Ensure level is a number
        }

        const questions = await addExamModel.find(query).sort({ level: 1 });
        
        // Group by level if requested
        if (groupByLevel === 'true') {
            const grouped = questions.reduce((acc, question) => {
                const levelKey = `level${question.level}`;
                if (!acc[levelKey]) {
                    acc[levelKey] = [];
                }
                acc[levelKey].push(question);
                return acc;
            }, {});
            
            return res.status(200).json({
                success: true,
                data: grouped,
                count: questions.length
            });
        }

        res.status(200).json({
            success: true,
            data: questions,
            count: questions.length
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch questions', 
            error: error.message 
        });
    }
};