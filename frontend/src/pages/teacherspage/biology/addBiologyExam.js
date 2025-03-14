import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../css/addexam.css';

const BiologyExam = () => {
    const navigator = useNavigate();
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index] = value;
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/bioExam', formData);
            setMessage(response.data.message);
            setFormData({
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                explanation: '',
            });
            navigator('/ap');
        } catch (error) {
            setMessage('Failed to add question. Please try again.');
        }
    };

    return (
        <div className="container">
            <h1>Add a New Question</h1>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Question:</label>
                    <textarea
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Options:</label>
                    {formData.options.map((option, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                required
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <label>Correct Answer:</label>
                    <input
                        type="text"
                        name="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Explanation:</label>
                    <textarea
                        name="explanation"
                        value={formData.explanation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Question</button>
            </form>
        </div>
    );
};

export default BiologyExam;