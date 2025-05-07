import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
 import SocialSidebarR from './socialSidebar';
import '../../css/entranceLayout.css';
import profile from '../../images/profile.png';
import bg from '../../images/bg3.png';
import NotificationBell from './notificationDisplaypage';

const SocialStudentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract the `id` parameter from the URL
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleLogout = () => {
    navigate('/logout'); // Redirect to the logout page
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

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
        <SocialSidebarR student={student} />
      </div>

      {/* Main Content */}
      <div className="main-content-container">
        <div className="headerstu">
          <img className="user-profile-img1" src={bg} alt="Background" />
          <h1>EthioAce</h1>
          <div className="user-profile1" onClick={toggleSidebar}>
            <div className="user-profile-info">
              <img className="user-profile-img" src={profile} alt="Profile" />
              <p className="user-profile-name">{student.name}</p>
            </div>
          </div>
          <div className="notify-me">
            <NotificationBell />
          </div>

          {/* Right Sidebar */}
          <div className={`sidebar-right ${sidebarVisible ? 'sidebar-open' : ''}`}>
            <div className="sidebar-content">
              <img className="user-profile-img" src={profile} alt="Profile" />
              <h3>{student.name}</h3>
              <p>{student.email}</p>
              <p>Social Science</p>
              <p>Grade 11</p>
            </div>
          </div>

          {/* Optional overlay */}
          {sidebarVisible && <div className="overlay" onClick={toggleSidebar}></div>}
        </div>

        <div className="mainofmain">
          <section className="dashboard-hero">
            <h1>Master Social Sciences with Ease</h1>
            <p>Explore comprehensive resources in English, Mathematics, Geography, History, Economics, and Aptitude to excel in your studies.</p>
            <div className="dashboard-hero-buttons">
              <button className="btn-primary">Explore Study Tips</button>
              <button className="btn-secondary">Start a Quiz</button>
            </div>
          </section>
        </div>

        <Outlet context={student} /> {/* Render child components (e.g., exams, courses) */}

        <section className="dashboard-content">
          <div className="content-section">
            <h3>Studying Progress</h3>
            <div className="content-cards">
              <div className="card">English Study Progress - 65%</div>
              <div className="card">Geography Study Progress - 80%</div>
            </div>
          </div>

          <div className="content-section">
            <h3>Recommended Study Materials</h3>
            <ul>
              <li>English Grammar and Composition</li>
              <li>World Geography Atlas</li>
              <li>Economics Fundamentals</li>
            </ul>
          </div>

          <div className="content-section">
            <h3>Quizzes</h3>
            <ul>
              <li>History Trivia Challenge</li>
              <li>Mathematics Problem Solving</li>
              <li>Aptitude Reasoning</li>
            </ul>
          </div>

          <div className="content-section">
            <h3>Study Groups</h3>
            <ul>
              <li>Geography Discussion Group</li>
              <li>History Study Circle</li>
              <li>Economics Debate Club</li>
            </ul>
          </div>

          <div className="content-section">
            <h3>Study Tips & Strategies</h3>
            <ul>
              <li>Effective Note-Taking for History</li>
              <li>Mastering Mathematical Concepts</li>
              <li>Critical Thinking for Aptitude Tests</li>
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
                <li><a href="#">What You Get Here</a></li>
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
    </div>
  );
};

export default SocialStudentPage;