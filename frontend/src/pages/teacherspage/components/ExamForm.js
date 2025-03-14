import React, { useState } from 'react';
import './ExamForm.css';

const ExamForm = () => {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const examData = {
      question,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      },
      correctAnswer,
      explanation,
    };
    console.log(examData);
    // You can handle further logic like saving to a backend or local storage
    alert('Exam Question Added Successfully');
  };

  return (
    <div className="exam-form-container">
      <h2>Add New Exam Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="optionA">Option A</label>
          <input
            type="text"
            id="optionA"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="optionB">Option B</label>
          <input
            type="text"
            id="optionB"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="optionC">Option C</label>
          <input
            type="text"
            id="optionC"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="optionD">Option D</label>
          <input
            type="text"
            id="optionD"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correctAnswer">Correct Answer</label>
          <select
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="">Select Answer</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="explanation">Explanation</label>
          <textarea
            id="explanation"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">Add Question</button>
      </form>
    </div>
  );
};

export default ExamForm;
