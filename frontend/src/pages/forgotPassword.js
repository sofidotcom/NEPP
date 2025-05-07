"use client"

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "../css/forgotPassword.css"; // Create this CSS file

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/password/request", { email });
      setMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
        setMessage("");
      } else {
        console.error("Request failed:", error.message);
      }
    }
  };

  return (
    <div className="forgot-password-page-container">
      <div className="forgot-password-content">
        <div className="forgot-password-form-section">
          <h1>EthioAce</h1>
          <h2>Forgot Password</h2>
          {message && <p className="success-message">{message}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
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
            <button type="submit">Send Reset Link</button>
          </form>
          <p>
            Back to <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;