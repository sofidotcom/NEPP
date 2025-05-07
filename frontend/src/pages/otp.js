import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../css/otp.css';

const OtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(120); // 2 minutes in seconds
  const [invalidInputs, setInvalidInputs] = useState([]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Handle OTP expiry timer
  useEffect(() => {
    const timer = setInterval(() => {
      setOtpExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          showNotification('OTP has expired. Please request a new one.', 'error');
          setOtp(['', '', '', '', '', '']);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Validate OTP
  const validateOtp = async (otpValue) => {
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      setInvalidInputs([0, 1, 2, 3, 4, 5]);
      showNotification('Please enter a valid 6-digit OTP.', 'error');
      return false;
    }

    if (otpExpiry <= 0) {
      showNotification('OTP has expired. Please request a new one.', 'error');
      return false;
    }

    try {
      const response = await verifyOtp(otpValue);
      if (response.success) {
        showNotification('OTP verified successfully!', 'success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        return true;
      } else {
        setInvalidInputs([0, 1, 2, 3, 4, 5]);
        showNotification('Incorrect OTP. Please try again.', 'error');
        return false;
      }
    } catch (error) {
      showNotification('An error occurred. Please try again later.', 'error');
      return false;
    }
  };

  // Handle input change and auto-focus
  const handleInputChange = async (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setInvalidInputs((prev) => prev.filter((i) => i !== index));

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Check OTP when last digit is entered
    if (index === 5 && value) {
      const otpValue = newOtp.join('');
      await validateOtp(otpValue);
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Generate random 6-digit OTP
  const generateRandomOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    return randomOtp.split('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    // Check for empty inputs
    const emptyIndices = otp.map((digit, i) => (digit ? -1 : i)).filter((i) => i >= 0);
    if (emptyIndices.length > 0) {
      setInvalidInputs(emptyIndices);
      showNotification('Please enter all OTP digits!', 'warning');
      // Auto-fill OTP if all digits are empty
      return;
    }

    await validateOtp(otpValue);
  };

  // Handle resend OTP
  const handleResend = async (e) => {
    e.preventDefault();
    if (isResendDisabled) return;

    try {
      await resendOtp();
      showNotification('New OTP sent successfully.', 'success');
      startResendTimer();
      setOtpExpiry(120); // Reset expiry timer
      setOtp(['', '', '', '', '', '']);
      setInvalidInputs([]);
    } catch (error) {
      showNotification('Failed to resend OTP. Please try again.', 'error');
    }
  };

  // Start resend timer
  const startResendTimer = () => {
    setIsResendDisabled(true);
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // Simulated API functions
  const verifyOtp = async (otp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: otp === '123456' }); // Simulated success
      }, 1000);
    });
  };

  const resendOtp = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md">
        <header className="text-center mb-6">
          <img
            src="ethioace-logo.png"
            alt="EthioAce Logo"
            className="mx-auto w-32 mb-2"
          />
          <h1 className="text-xl font-bold text-blue-600">
            EthioAce National Exam Preparation
          </h1>
        </header>
        <main>
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Verify Your Account</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit OTP sent to your registered email or phone number.
            </p>
            <div className="expiry-timer text-sm text-gray-600 mb-4">
              OTP expires in{' '}
              <span className="font-semibold">
                {Math.floor(otpExpiry / 60)}:{(otpExpiry % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className={`w-10 h-10 text-center text-lg border rounded ${
                      invalidInputs.includes(index) ? 'invalid' : ''
                    }`}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded transition"
              >
                Verify OTP
              </button>
            </form>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Didn't receive the OTP?{' '}
                <a
                  href="#"
                  onClick={handleResend}
                  className={`text-blue-600 ${isResendDisabled ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Resend OTP
                </a>
              </p>
              {isResendDisabled && (
                <p className="text-sm text-gray-600 mt-2">
                  Resend available in{' '}
                  <span className="font-semibold">{countdown}</span> seconds
                </p>
              )}
            </div>
            {notification.message && (
              <div className={`notification ${notification.type}`}>
                {notification.type === 'warning' && (
                  <span className="notification-icon">⚠️ </span>
                )}
                {notification.type === 'success' && (
                  <span className="notification-icon">✅ </span>
                )}
                {notification.type === 'error' && (
                  <span className="notification-icon">❌ </span>
                )}
                {notification.message}
              </div>
            )}
          </div>
        </main>
        <footer className="text-center mt-6 text-sm text-gray-600">
          <p>© 2025 EthioAce. All rights reserved.</p>
          <p>
            <a href="/support" className="text-blue-600">
              Contact Support
            </a>{' '}
            |{' '}
            <a href="/privacy" className="text-blue-600">
              Privacy Policy
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OtpPage;