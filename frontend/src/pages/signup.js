import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import signupImage from '../images/pc2.jpg'; // Replace with your image
import '../css/signup.css'; // Import the CSS file

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/signup/', { name, email, password, phoneNumber });
            localStorage.setItem('userId', response.data.userId);
            // navigate(response.data.redirect);
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
                            phoneNumber
                            <input
                                type="password"
                                value={phoneNumber}
                                onChange={(e) => setphoneNumber(e.target.value)}
                                placeholder="09 enter yourphone number"
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