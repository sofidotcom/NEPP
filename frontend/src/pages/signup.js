import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import signupImage from '../images/icon1.png'; // Replace with your image
import '../css/signup.css'; // Import the CSS file

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [stream, setStream] = useState('');
    const [yourGoal, setYourGoal] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Ensure the input starts with +251 and allows only digits after
        if (value.startsWith('+251') || value === '') {
            setPhoneNumber(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/signup/', { name, email, password, phoneNumber, stream, yourGoal });
            localStorage.setItem('userId', response.data.userId);
            navigate('/login');
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                console.error('Signup failed:', error.message);
            }
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup-content">
                <div className="signup-form-section">
                    <h1>EthioAce</h1>
                    {errorMessage && <p className="signup-error-message">{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        <label>
                            Full Name
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </label>
                        <label>
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </label>
                        <label>
                            Phone Number
                            <div className="phone-input">
                                <span className="country-code">+251</span>
                                <input
                                    type="text"
                                    value={phoneNumber.slice(4)} // Remove +251 for display
                                    onChange={(e) => setPhoneNumber('+251' + e.target.value.replace(/\D/g, ''))}
                                    placeholder="Enter your phone number"
                                    required
                                    pattern="\d{9}"
                                    maxLength="9"
                                />
                            </div>
                        </label>
                        <label>
                            Stream
                            <select
                                value={stream}
                                onChange={(e) => setStream(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select your stream</option>
                                <option value="Natural">Natural</option>
                                <option value="Social">Social</option>
                            </select>
                        </label>
                        <label>
                            Your Goal
                            <input
                                type="number"
                                value={yourGoal}
                                onChange={(e) => setYourGoal(e.target.value)}
                                placeholder="Enter your goal"
                                required
                            />
                        </label>
                        <button type="submit">Sign Up</button>
                    </form>
                    <p>Already have an account? <a href="/login">Log in</a></p>
                </div>
                <div className="signup-image-section">
                    <img src={signupImage} alt="Description of the image" />
                </div>
            </div>
        </div>
    );
};

export default SignUp;