"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// import "../css/resetPassword.css"; // Create this CSS file

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`/api/v1/password/verify/${token}`);
        setIsTokenValid(true);
      } catch (error) {
        setErrorMessage(error.response?.data.message || "Invalid or expired token");
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/v1/password/reset/${token}`, { password });
      setMessage(response.data.message);
      setErrorMessage("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
        setMessage("");
      } else {
        console.error("Reset failed:", error.message);
      }
    }
  };

  if (!isTokenValid) {
    return (
      <div className="reset-password-page-container">
        <div className="reset-password-content">
          <h1>EthioAce</h1>
          <p className="error-message">{errorMessage}</p>
          <p>
            Back to <a href="/login">Login</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page-container">
      <div className="reset-password-content">
        <div className="reset-password-form-section">
          <h1>EthioAce</h1>
          <h2>Reset Password</h2>
          {message && <p className="success-message">{message}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              New Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </label>
            <button type="submit">Reset Password</button>
          </form>
          <p>
            Back to <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;