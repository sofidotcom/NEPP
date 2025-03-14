const EntranceModel = require('../model/addEntranceModel');

exports.createEntrance = async (req, res) => {
  try {
    const teacherSubject = req.user.subject;
    const teacherId = req.user.userId;
    const { questionText, correctAnswer, year } = req.body;

    // Build options
    const options = [];
    for (let i = 0; i < 4; i++) {
      const text = req.body[`options[${i}][text]`] || '';
      const image = req.files?.[`options[${i}][image]`] 
        ? req.files[`options[${i}][image]`][0].path 
        : null;

      options.push({ text, image });
    }

    const questionImage = req.files?.questionImage
      ? req.files.questionImage[0].path
      : null;

    const newEntrance = new EntranceModel({
      question: {
        text: questionText,
        image: questionImage,
      },
      options,
      correctAnswer,
      year,
      subject: teacherSubject,
      createdBy: teacherId,
    });

    await newEntrance.save();

    res.status(200).json({ message: 'Successfully added the exam question' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add the question' });
  }
};

exports.getEntrance = async (req, res) => {
  try {
    const { year } = req.params;
    const exams = await EntranceModel.find({ year });
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving exams' });
  }
};



