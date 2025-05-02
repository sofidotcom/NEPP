import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useParams, Outlet } from 'react-router-dom';
import SidebarR from './studentSideBar';
import '../../css/entranceLayout1.css';
import profile from '../../images/profile.png';
import bg from '../../images/bg3.png';

import NotificationBell from './notificationDisplaypage';


 // Import CSS for layout

const StudentPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout'); // Redirect to the logout page
  };
 
    const [sidebarVisible, setSidebarVisible] = useState(false);
  
    const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
    };
 
  const { id } = useParams(); // Extract the `id` parameter from the URL
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError('Student ID is missing');
        return;
      }

      try {
        const response = await axios.get(`/api/v1/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        setError('Error fetching student data');
      }
    };

    fetchStudentData();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!student) return <div className="loading">Loading...</div>;

  return (
    <div className="layout-container">
      
      <div className="sidebar-container">
        <SidebarR student={student} /> {/* Pass student data as props */}
      </div>

      {/* Main Content */}
      <div className="main-content-container">
       <div className='headerstu'>
       <img className="user-profile-img1" src={bg}/>
        <h1>EthioAce</h1>
        <>
      <div className="user-profile1" onClick={toggleSidebar}>
        <div className="user-profile-info">
          <img className="user-profile-img" src={profile} alt="Profile" />
          <p className="user-profile-name">{student.name}</p>
        </div> 
      </div>
      <div className='notify-me'><NotificationBell /></div>
      
      {/* Right Sidebar */}
      <div className={`sidebar-right ${sidebarVisible ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
        <img className="user-profile-img" src={profile}/>
          <h3>{student.name}</h3>
          <p>{student.email}</p>
          <p>natural science</p>
          <p>grade 11</p>
          {/* <Link to="/profile">View Profile</Link>
          <Link to="/logout" className="sidebar-r-logoutt">Logout</Link> */}
        </div>
      </div>

      {/* Optional overlay */}
      {sidebarVisible && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
       </div>
       <div className='mainofmain'>
         <section className="dashboard-hero">
            <h1>Ace Your Exams with Confidence</h1>
               <p>Comprehensive study materials, practice tests, and expert guidance to help you succeed.</p>
        <div className="dashboard-hero-buttons">
          <button className="btn-primary"> Getting tips Now</button>
          <button className="btn-secondary">Take a Practice Test</button>
        </div>
      </section></div>
        {/* <Outlet context={student}/> Render child components (e.g., exams, courses) */}
      </div>
      <section className="dashboard-content">
          <div className="content-section">
            <h3>studying progress</h3>
            <div className="content-cards">
              <div className="card">Biology study progress - 72%</div>
              <div className="card">mathematics Study progress - 27%</div>
            </div>
          </div>

          <div className="content-section">
            <h3>Recommended Study Materials</h3>
            <ul>
              <li>mathematics mega grade 11 and 12</li>
              <li>biology extreme book</li>
              
            </ul>
          </div>

          <div className="content-section">
            <h3>Quizzes</h3>
            <ul>
              <li>civics and ethics</li>
              <li>physics</li>
              <li>Chemistry</li>
            </ul>
          </div>

          <div className="content-section">
            <h3>Study Groups</h3>
            <ul>
              <li>English Study Group</li>
              <li>Chemistery Challenge Group</li>
              <li>Mathematics derivative group</li>
            </ul>
          </div>

          <div className="content-section">
            <h3>Study Tips & Strategies</h3>
            <ul>
              <li>Active Recall Technique</li>
              <li>Spaced Repetition System</li>
              <li>Visual Learning with Mind Maps</li>
            </ul>
          </div>
        </section>
      <div className="footer">
  <div className="footer-top">
    <div className="footer-column">
      <h4>About</h4>
      <ul>
        <li><a href="#">Who We Are</a></li>
        <li><a href="#">Our Mission</a></li>
        <li><a href="#">what you get here</a></li>
      </ul>
    </div>

    <div className="footer-column">
      <h4>Explore</h4>
      <ul>
        <li><a href="#">Subjects</a></li>
        <li><a href="#">Tips & Guides</a></li>
        <li><a href="#">Certifications</a></li>
        <li><a href="#">Learning Paths</a></li>
      </ul>
    </div>

    <div className="footer-column">
      <h4>Help</h4>
      <ul>
        <li><a href="#">Support Center</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">FAQs</a></li>
        <li><a href="#">Terms & Policies</a></li>
      </ul>
    </div>

    <div className="footer-column">
      <h4>Connect</h4>
      <div className="social-icons">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-linkedin-in"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
      </div>
      <div className="language-select">
        🌐 <select>
          <option>English</option>
          <option>አማርኛ</option>
        </select>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2025 EthioAce. All rights reserved.</p>
    <div className="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Cookie Preferences</a>
    </div>
  </div>
</div>

          

    </div>
  );
};

export default StudentPage;
