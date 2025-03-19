import React, { useState } from 'react';
import '../../css/Sidebar.css';
import { Link } from 'react-router-dom';


const SidebarR = ({ student }) => {
  const [openCourses, setOpenCourses] = useState(false);
  const [openExams, setOpenExams] = useState(false);
  const [openQuizzes, setOpenQuizzes] = useState(false);
  const [openBiologyExams, setOpenBiologyExams] = useState(false);
  const [openChemistryExams, setOpenChemistryExams] = useState(false);

  // State for nested folders in Courses section
  const [openBiology, setOpenBiology] = useState(false);
  const [openChemistry, setOpenChemistry] = useState(false);
  const [openPhysics, setOpenPhysics] = useState(false);

  const toggleCourses = () => setOpenCourses(!openCourses);
  const toggleExams = () => setOpenExams(!openExams);
  const toggleQuizzes = () => setOpenQuizzes(!openQuizzes);
  const toggleBiologyExams = () => setOpenBiologyExams(!openBiologyExams);
  const toggleChemistryExams = () => setOpenChemistryExams(!openChemistryExams);

  // Toggle functions for nested folders in Courses section
  const toggleBiology = () => setOpenBiology(!openBiology);
  const toggleChemistry = () => setOpenChemistry(!openChemistry);
  const togglePhysics = () => setOpenPhysics(!openPhysics);

  return (
    <div className="sidebar">
      {/* Student Profile Section */}
      <div className="profile-section">
        <h3>EthioAce</h3>
        <p> For your Future</p>
      </div>

      {/* Courses Section */}
      <div className="sidebar-section">
        <div className="section-header" onClick={toggleCourses}>
          <span>Courses</span>
          <span>{openCourses ? '▼' : '▶'}</span>
        </div>
        {openCourses && (
          <div className="section-content">
            {/* Biology Folder */}
            <div className="folder-item">
              <div className="sub-section-header" onClick={toggleBiology}>
                <span>Biology</span>
                <span>{openBiology ? '▼' : '▶'}</span>
              </div>
              {openBiology && (
                <div className="sub-folder">
                  <div className="folder-item">
                    <Link to="/notes/biology" className="navv">Short Notes</Link>
                  </div>
                  <div className="folder-item">
                    <Link to="/download" className="navv">Resources</Link>
                  </div>
                  <div className="folder-item">
                    <Link to="/courses/biology/videos" className="navv">Videos</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Chemistry Folder */}
            <div className="folder-item">
              <div className="sub-section-header" onClick={toggleChemistry}>
                <span>Chemistry</span>
                <span>{openChemistry ? '▼' : '▶'}</span>
              </div>
              {openChemistry && (
                <div className="sub-folder">
                  <div className="folder-item">
                    <Link to="/notes/chemistry" className="navv">Short Notes</Link>
                  </div>
                  <div className="folder-item">
                    <Link to="/download" className="navv">Resources</Link>
                  </div>
                  <div className="folder-item">
                    <Link to="/courses/chemistry/videos" className="navv">Videos</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Physics Folder */}
            <div className="folder-item">
              <div className="sub-section-header" onClick={togglePhysics}>
                <span>Physics</span>
                <span>{openPhysics ? '▼' : '▶'}</span>
              </div>
              {openPhysics && (
                <div className="sub-folder">
                  <div className="folder-item">
                    <Link to="/notes/physics" className="navv">Short Notes</Link>
                  </div>
                  <div className="folder-item">
                    <Link to="/download" className="navv">Resources</Link>
                  </div>
                  <div className="folder-item">
                    <Link to="/courses/physics/videos" className="navv">Videos</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Exams Section */}
      <div className="sidebar-section">
        <div className="section-header" onClick={toggleExams}>
          <span>Exams</span>
          <span>{openExams ? '▼' : '▶'}</span>
        </div>
        {openExams && (
          <div className="section-content">
            {/* Biology Exams */}
            <div className="folder-item">
              <div className="sub-section-header" onClick={toggleBiologyExams}>
                <span>Biology</span>
                <span>{openBiologyExams ? '▼' : '▶'}</span>
              </div>
              {openBiologyExams && (
                <div className="sub-folder">
                  <div className="folder-item">
                    <nav> <Link to="/bioEntrance/2014" className="navv">2014 Exam</Link></nav>
                  </div>
                  <div className="folder-item">
                    <nav> <Link to="/bioEntrance/2015" className="navv">2015 Exam</Link></nav>
                  </div>
                  <div className="folder-item">
                    <nav> <Link to="/bioEntrance/2016" className="navv">2016 Exam</Link></nav>
                  </div>
                </div>
              )}
            </div>

            {/* Chemistry Exams */}
            <div className="folder-item">
              <div className="sub-section-header" onClick={toggleChemistryExams}>
                <span>Chemistry</span>
                <span>{openChemistryExams ? '▼' : '▶'}</span>
              </div>
              {openChemistryExams && (
                <div className="sub-folder">
                  <div className="folder-item">2012</div>
                  <div className="folder-item">2013</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quizzes Section */}
      <div className="sidebar-section">
        <div className="section-header" onClick={toggleQuizzes}>
          <span>Quizzes</span>
          <span>{openQuizzes ? '▼' : '▶'}</span>
        </div>
        {openQuizzes && (
          <div className="section-content">
            <div className="folder-item">Biology</div>
            <div className="folder-item">Chemistry</div>
          </div>
        )}
      </div>

      {/* Other Sections */}
      <div className="sidebar-section">
        <div className="section-header">
          <span>Success Story</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <span>Downloads</span>
        </div>
      </div>
      <div className="sidebar-section">
        <div className="section-header">
         <Link to ='/logout' className='logoutt'>Logout</Link> 
        </div>
      </div>
    </div>
  );
};

export default SidebarR;