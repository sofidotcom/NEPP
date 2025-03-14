import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the user's session or token
    localStorage.removeItem('userId'); // Remove the userId from localStorage
    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  return (
    <div className="logout-container">
      
      <p>LOGOUT</p>
    </div>
  );
};

export default Logout;