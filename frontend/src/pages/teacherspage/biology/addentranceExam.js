import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/addexam.css";

const BiologyAddEntrance = () => {
  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    questionText: "",
    questionImage: null,
    options: [
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null },
    ],
    correctAnswer: "",
    year: "",
    subject: "",
    grade: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFormData((prev) => ({
        ...prev,
        subject: decodedToken.subject || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index][field] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleImageChange = (e, type, index = null) => {
    const file = e.target.files[0];
    if (type === "question") {
      setFormData({ ...formData, questionImage: file });
    } else if (type === "option") {
      const updatedOptions = [...formData.options];
      updatedOptions[index].image = file;
      setFormData({ ...formData, options: updatedOptions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();

    formDataToSend.append("questionText", formData.questionText);
    formDataToSend.append("year", formData.year);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("correctAnswer", formData.correctAnswer);
    formDataToSend.append("grade", formData.grade);

    if (formData.questionImage) {
      formDataToSend.append("questionImage", formData.questionImage);
    }

    formData.options.forEach((option, index) => {
      formDataToSend.append(`optionText${index}`, option.text);
      if (option.image) {
        formDataToSend.append(`optionImage${index}`, option.image);
      }
    });

    try {
      const response = await axios.post("/api/v1/bioEntrance", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setFormData({
        questionText: "",
        questionImage: null,
        options: [
          { text: "", image: null },
          { text: "", image: null },
          { text: "", image: null },
          { text: "", image: null },
        ],
        correctAnswer: "",
        year: "",
        subject: formData.subject,
        grade: "",
      });
    } catch (error) {
      setMessage("Failed to add question. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Add new {formData.subject} entrance exam</h1>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Question (Text):</label>
          <textarea name="questionText" value={formData.questionText} onChange={handleChange} />
        </div>

        <div>
          <label>Question (Image):</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "question")} />
        </div>

        <div>
          <label>Options:</label>
          {formData.options.map((option, index) => (
            <div key={index} className="option-container">
              <input
                type="text"
                placeholder={`Option ${index + 1} Text`}
                value={option.text}
                onChange={(e) => handleOptionChange(index, "text", e.target.value)}
              />
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "option", index)} />
            </div>
          ))}
        </div>

        <div>
          <label>Correct Answer (Text):</label>
          <input type="text" name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} required />
        </div>

        <div>
          <label>Year:</label>
          <input type="text" name="year" value={formData.year} onChange={handleChange} required />
        </div>

        <div>
          <label>Grade:</label>
          <select name="grade" value={formData.grade} onChange={handleChange} required>
            <option value="">Select Grade</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>

        <div>
          <label>Subject:</label>
          <input type="text" name="subject" value={formData.subject} disabled />
        </div>

        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default BiologyAddEntrance;



