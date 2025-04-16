import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../../../css/addexam.css';

const BiologyExam = () => {
    const navigator = useNavigate();
    const [formData, setFormData] = useState({
        subject: '',
        level: 1,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setFormData(prev => ({
                    ...prev,
                    subject: decodedToken.subject || ''
                }));
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

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
            const response = await axios.post('/api/v1/quiz', formData);
            setMessage(response.data.message);
            setFormData(prev => ({
                ...prev,
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                explanation: '',
            }));
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
                    <label>Subject:</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled
                        required
                    />
                </div>
                <div>
                    <label>
                        Level (1-5):
                        <input 
                            type="number" 
                            name="level" 
                            min="1" 
                            max="5" 
                            value={formData.level}
                            onChange={handleChange}
                        />
                    </label>
                </div>
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