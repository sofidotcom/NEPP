import React from 'react';
import './Sidebar.css';

function Sidebar({ show, toggleSidebar }) {
  return (
    <div className={`sidebar ${show ? 'show' : ''}`}>
      <h2>Teacher Profile</h2>
      <img src="/profile-picture.jpg" alt="Profile" />
      <p>Email: teacher@example.com</p>
      <p>Phone: +1234567890</p>
      <button onClick={toggleSidebar}>Close Sidebar</button>
      <hr />
      <h3>Settings</h3>
      <ul>
        <li>Profile Settings</li>
        <li>Account Settings</li>
        <li>Log Out</li>
      </ul>
    </div>
  );
}

export default Sidebar;
