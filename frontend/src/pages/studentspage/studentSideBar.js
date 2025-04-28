import React, { useState } from 'react';
import '../../css/Sidebar.css';
import { Link } from 'react-router-dom';

const SidebarR = ({ student }) => {
  const [openCourses, setOpenCourses] = useState(false);
  const [openExams, setOpenExams] = useState(false);
  const [openQuizzes, setOpenQuizzes] = useState(false);
  const [openBiologyExams, setOpenBiologyExams] = useState(false);
  const [openChemistryExams, setOpenChemistryExams] = useState(false);
  const [openBiology, setOpenBiology] = useState(false);
  const [openChemistry, setOpenChemistry] = useState(false);
  const [openPhysics, setOpenPhysics] = useState(false);
  const [openBioGrades, setOpenBioGrades] = useState(false);
  const [openChemGrades, setOpenChemGrades] = useState(false);
  const [openPhysicsGrades, setOpenPhysicsGrades] = useState(false);

  const toggleCourses = () => setOpenCourses(!openCourses);
  const toggleExams = () => setOpenExams(!openExams);
  const toggleQuizzes = () => setOpenQuizzes(!openQuizzes);
  const toggleBiologyExams = () => setOpenBiologyExams(!openBiologyExams);
  const toggleChemistryExams = () => setOpenChemistryExams(!openChemistryExams);
  const toggleBiology = () => setOpenBiology(!openBiology);
  const toggleChemistry = () => setOpenChemistry(!openChemistry);
  const togglePhysics = () => setOpenPhysics(!openPhysics);
  const toggleBioGrades = () => setOpenBioGrades(!openBioGrades);
  const toggleChemGrades = () => setOpenChemGrades(!openChemGrades);
  const togglePhysicsGrades = () => setOpenPhysicsGrades(!openPhysicsGrades);

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  return (
    <div className="sidebar-r">
      <div className="sidebar-r-profile-section">
        <h3>EthioAce</h3>
        <p>For your Future</p>
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header" onClick={toggleCourses}>
          <span>Courses</span>
          <span>{openCourses ? '▼' : '▶'}</span>
        </div>
        {openCourses && (
          <div className="sidebar-r-section-content">
            <div className="sidebar-r-folder-item">
              <div className="sidebar-r-sub-section-header" onClick={toggleBiology}>
                <span>Biology</span>
                <span>{openBiology ? '▼' : '▶'}</span>
              </div>
              {openBiology && (
                <div className="sidebar-r-sub-folder">
                  <div className="sidebar-r-folder-item">
                    <div className="sidebar-r-sub-section-header" onClick={toggleBioGrades}>
                      <span>Short Notes</span>
                      <span>{openBioGrades ? '▼' : '▶'}</span>
                    </div>
                    {openBioGrades && (
                      <div className="sidebar-r-sub-folder">
                        <div className="sidebar-r-folder-item">
                          <Link to={`/notes/biology/grade9`} className="sidebar-r-navv">Grade 9</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to="/notes/biology/grade10" className="sidebar-r-navv">Grade 10</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to={`/notes/biology/grade11`} className="sidebar-r-navv">Grade 11</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to={`/notes/biology/grade12`} className="sidebar-r-navv">Grade 12</Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/download" className="sidebar-r-navv">Resources</Link>
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/courses/biology/videos" className="sidebar-r-navv">Videos</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar-r-folder-item">
              <div className="sidebar-r-sub-section-header" onClick={toggleChemistry}>
                <span>Chemistry</span>
                <span>{openChemistry ? '▼' : '▶'}</span>
              </div>
              {openChemistry && (
                <div className="sidebar-r-sub-folder">
                  <div className="sidebar-r-folder-item">
                    <div className="sidebar-r-sub-section-header" onClick={toggleChemGrades}>
                      <span>Short Notes</span>
                      <span>{openChemGrades ? '▼' : '▶'}</span>
                    </div>
                    {openChemGrades && (
                      <div className="sidebar-r-sub-folder">
                        <div className="sidebar-r-folder-item">
                          <Link to={`/notes/chemistry/grade9`} className="sidebar-r-navv">Grade 9</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to={`/notes/chemistry/grade10`} className="sidebar-r-navv">Grade 10</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to={`/notes/chemistry/grade11`} className="sidebar-r-navv">Grade 11</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to={`/notes/chemistry/grade12`} className="sidebar-r-navv">Grade 12</Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/download" className="sidebar-r-navv">Resources</Link>
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/courses/chemistry/videos" className="sidebar-r-navv">Videos</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar-r-folder-item">
              <div className="sidebar-r-sub-section-header" onClick={togglePhysics}>
                <span>Physics</span>
                <span>{openPhysics ? '▼' : '▶'}</span>
              </div>
              {openPhysics && (
                <div className="sidebar-r-sub-folder">
                  <div className="sidebar-r-folder-item">
                    <div className="sidebar-r-sub-section-header" onClick={togglePhysicsGrades}>
                      <span>Short Notes</span>
                      <span>{openPhysicsGrades ? '▼' : '▶'}</span>
                    </div>
                    {openPhysicsGrades && (
                      <div className="sidebar-r-sub-folder">
                        <div className="sidebar-r-folder-item">
                          <Link to="/notes/physics/grade9" className="sidebar-r-navv">Grade 9</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to="/notes/physics/grade10" className="sidebar-r-navv">Grade 10</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to="/notes/physics/grade11" className="sidebar-r-navv">Grade 11</Link>
                        </div>
                        <div className="sidebar-r-folder-item">
                          <Link to="/notes/physics/grade12" className="sidebar-r-navv">Grade 12</Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/download" className="sidebar-r-navv">Resources</Link>
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/courses/physics/videos" className="sidebar-r-navv">Videos</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header" onClick={toggleExams}>
          <span>Exams</span>
          <span>{openExams ? '▼' : '▶'}</span>
        </div>
        {openExams && (
          <div className="sidebar-r-section-content">
            <div className="sidebar-r-folder-item">
              <div className="sidebar-r-sub-section-header" onClick={toggleBiologyExams}>
                <span>Biology</span>
                <span>{openBiologyExams ? '▼' : '▶'}</span>
              </div>
              {openBiologyExams && (
                <div className="sidebar-r-sub-folder">
                  <div className="sidebar-r-folder-item">
                    <Link to="/entrance/Biology/2014" className="sidebar-r-navv">2014 Exam</Link>
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/entrance/Biology/2015" className="sidebar-r-navv">2015 Exam</Link>
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/entrance/Biology/2016" className="sidebar-r-navv">2016 Exam</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar-r-folder-item">
              <div className="sidebar-r-sub-section-header" onClick={toggleChemistryExams}>
                <span>Chemistry</span>
                <span>{openChemistryExams ? '▼' : '▶'}</span>
              </div>
              {openChemistryExams && (
                <div className="sidebar-r-sub-folder">
                  <div className="sidebar-r-folder-item">
                    <Link to="/entrance/Chemistry/2014" className="sidebar-r-navv">2014 Exam</Link>
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/entrance/Chemistry/2015" className="sidebar-r-navv">2015 Exam</Link>
                  </div>
                  <div className="sidebar-r-folder-item">
                    <Link to="/entrance/Chemistry/2016" className="sidebar-r-navv">2016 Exam</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header" onClick={toggleQuizzes}>
          <span>Quizzes</span>
          <span>{openQuizzes ? '▼' : '▶'}</span>
        </div>
        {openQuizzes && (
          <div className="sidebar-r-section-content">
            <Link 
              to={{
                pathname: "/quiz",
                search: "?subject=Biology&groupByLevel=true"
              }}
              className="sidebar-r-folder-item"
            >
              Biology 
            </Link>
            <Link 
              to={{
                pathname: "/quiz",
                search: "?subject=Chemistry&groupByLevel=true"
              }}
              className="sidebar-r-folder-item"
            >
              Chemistry 
            </Link>
            <Link 
              to={{
                pathname: "/quiz",
                search: "?subject=Physics&groupByLevel=true"
              }}
              className="sidebar-r-folder-item"
            >
              Physics
            </Link>
          </div>
        )}
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">
          <span>Success Story</span>
        </div>
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">
          <span>Downloads</span>
        </div>
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">
          <Link to="/chat-rooms" className="sidebar-r-logoutt">Goto Chat</Link>
        </div>
      </div>
      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">
          <Link to={`/profile/${userId}`} className="sidebar-r-logoutt">Profile</Link>
        </div>
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">
          <Link to="/logout" className="sidebar-r-logoutt">Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarR;