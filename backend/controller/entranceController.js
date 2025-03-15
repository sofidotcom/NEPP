const EntranceModel = require("../model/addEntranceModel")

exports.createEntrance = async (req, res) => {
  try {
    console.log("Incoming body:", req.body)
    console.log("Incoming files:", req.files)

    const teacherSubject = req.user.subject
    const teacherId = req.user.userId

    const { questionText, correctAnswer, year } = req.body

    // Build options from the request data
    const options = []
    for (let i = 0; i < 4; i++) {
      const text = req.body[`optionText${i}`] || ""
      const imageFile = req.files?.[`optionImage${i}`]
      const image = imageFile ? imageFile[0].path : null

      console.log(`Option ${i}:`, { text, image }) // Debugging log

      options.push({ text, image })
    }

    const questionImageFile = req.files?.questionImage
    const questionImage = questionImageFile ? questionImageFile[0].path : null

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
    })

    await newEntrance.save()

    res.status(200).json({ message: "Successfully added the exam question" })
  } catch (error) {
    console.error("Error adding question:", error)
    res.status(500).json({ message: "Failed to add the question" })
  }
}

exports.getEntrance = async (req, res) => {
  try {
    const { year } = req.params
    const exams = await EntranceModel.find({ year })
    res.json(exams)
  } catch (error) {
    console.error("Error retrieving exams:", error)
    res.status(500).json({ error: "Error retrieving exams" })
  }
}

