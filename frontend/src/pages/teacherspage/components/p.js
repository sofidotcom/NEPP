import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './p.css';
//import Sidebar from './Sidebar';
import CourseForm from './CourseForm';
import ShortNote from './ShortNote';
import TipForm from './TipForm';
import ExamForm from './ExamForm';
import UploadNoteForm from '../notePage';

import BiologyAddEntrance from '../biology/addentranceExam';
import BiologyExam from '../biology/addBiologyExam';
// import QuizForm from './components/QuizForm';
import ProgressViewer from './ProgressViewer';
import { FaUserCircle, FaBars, FaSearch, FaCalendarAlt, FaLightbulb } from 'react-icons/fa';

function Ap() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);
  const handleFormChange = (formName) => setActiveForm(formName);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleMainContentClick = () => {
    if (showSidebar) {
      closeSidebar();
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* <div
        className={`profile-sidebar ${showSidebar ? 'sidebar-active' : ''}`}
      >
        <Sidebar show={showSidebar} toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div> */}

      <div className="main-content">
        <header className="app-header">
        
          <h1 className="brand-title">EthioAce</h1>
          <nav className="nav-links">
        
            <a onClick={() => handleFormChange('note')} className={activeForm === 'note' ? 'active' : ''}>Add Note</a>
            <a onClick={() => handleFormChange('tip')} className={activeForm === 'tip' ? 'active' : ''}>Tips</a>
            <a onClick={() => handleFormChange('exam')} className={activeForm === 'exam' ? 'active' : ''}>Add Exam</a>
            <a onClick={() => handleFormChange('quiz')} className={activeForm === 'quiz' ? 'active' : ''}>Add Quiz</a>
            <a onClick={() => handleFormChange('progress')} className={activeForm === 'progress' ? 'active' : ''}>View Progress</a>
              <Link to ='/logout' className='logoutt'>Logout</Link>
          </nav>
          <div className="header-right">
            <input type="text" placeholder="Search..." className="search-bar" />
            <FaSearch className="search-icon" />
            <FaUserCircle className="profile-icon" onClick={toggleSidebar} />
          </div>
        </header>

        <main className="dashboard-content">
          
          {activeForm === 'note' && <UploadNoteForm />}
          {activeForm === 'tip' && < TipForm />}
          {activeForm === 'exam' && <BiologyAddEntrance/>}
          {activeForm === 'quiz' && <BiologyExam/>}
          {activeForm === 'progress' && <ProgressViewer />}

          {!activeForm && (
            <div className="dashboard-overview">
              <div className="analytics-card">
                <h3>Student Progress</h3>
                {/* Placeholder for analytics graph */}
              </div>
              <div className="todo-card">
                <h3>To-Do List</h3>
                <textarea placeholder="Enter your tasks here..."></textarea>
              </div>
              <div className="recently-added">
                <h3>Recently Added</h3>
                {/* Placeholder for recent items */}
              </div>
              <div className="calendar-card">
                
                <FaCalendarAlt className="calendar-icon"/>
                {/* Calendar component placeholder */}
              </div>
              <div className="quick-notes">
                <h3>Quick Notes</h3>
                <textarea placeholder="Quick notes here..."></textarea>
                <FaLightbulb className="lightbulb-icon"/>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Contact Us | Privacy Policy | Terms & Conditions</p>
        </footer>
      </div>
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
    </div>
  );
}

export default Ap;