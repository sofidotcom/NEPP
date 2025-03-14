import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../css/display.css';

const BioExamDisplay = () => {
    const [questions, setQuestions] = useState([]);
    const [feedback, setFeedback] = useState({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('/api/v1/bioExam');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error.message);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswerClick = (questionId, selectedOption, correctAnswer, explanation) => {
        if (feedback[questionId]) return; // Prevent multiple clicks for the same question

        const isCorrect = selectedOption === correctAnswer;
        setFeedback((prev) => ({
            ...prev,
            [questionId]: { isCorrect, explanation, selectedOption },
        }));
    };

   return (
    <div  className='continerrr'>
        
        {questions.map((question, index) => (
            <div className="question-container" key={question._id}>
                <h3 className="question-text">Question {index + 1}: {question.question}</h3>
                <div className="options-container">
                    {question.options.map((option, index) => (
                        <div key={index}>
                            <button
                                className={`option-button ${feedback[question._id]?.selectedOption === String.fromCharCode(65 + index) ? (feedback[question._id].isCorrect ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleAnswerClick(
                                    question._id,
                                    String.fromCharCode(65 + index),
                                    question.correctAnswer,
                                    question.explanation
                                )}
                                disabled={!!feedback[question._id]}
                            >
                                {String.fromCharCode(65 + index)}
                            </button>
                            <span>{option}</span>
                        </div>
                    ))}
                </div>
                {feedback[question._id] && (
                    <p className="feedback-text">
                        {feedback[question._id].isCorrect
                            ? 'Correct!'
                            : `Wrong! The correct answer is: ${question.correctAnswer}.`}
                        <br />
                        Explanation: {feedback[question._id].explanation}
                    </p>
                )}
            </div>
        ))}
    </div>
);
};

export default BioExamDisplay;