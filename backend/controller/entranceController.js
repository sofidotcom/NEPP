const EntranceModel = require("../model/addEntranceModel");


exports.createEntrance = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    console.log("Incoming files:", req.files);

    const teacherSubject = req.user.subject;
    const teacherId = req.user.userId;

    const { questionText, correctAnswer, year, grade } = req.body;

    // Validate grade
    if (!['9', '10', '11', '12'].includes(grade)) {
      return res.status(400).json({ message: "Invalid grade. Must be 9, 10, 11, or 12" });
    }

    const options = [];
    for (let i = 0; i < 4; i++) {
      const text = req.body[`optionText${i}`] || "";
      const imageFile = req.files?.[`optionImage${i}`];
      const image = imageFile ? imageFile[0].path : null;
      options.push({ text, image });
    }

    const questionImageFile = req.files?.questionImage;
    const questionImage = questionImageFile ? questionImageFile[0].path : null;

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
      grade,
    });

    await newEntrance.save();
    res.status(200).json({ message: "Successfully added the exam question" });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Failed to add the question" });
  }
};
exports.getEntrance = async (req, res) => {
  try {
    const { subject, year } = req.params; // Now subject comes before year
    const exams = await EntranceModel.find({ subject, year }); // Query matches the order
    res.json(exams);
  } catch (error) {
    console.error("Error retrieving exams:", error);
    res.status(500).json({ error: "Error retrieving exams" });
  }
};

