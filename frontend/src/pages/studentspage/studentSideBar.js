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

  return (
    <div className="sidebar">
      <div className="profile-section">
        <h3>EthioAce</h3>
        <p>For your Future</p>
      </div>

      <div className="sidebar-section">
        <div className="section-header" onClick={toggleCourses}>
          <span>Courses</span>
          <span>{openCourses ? '▼' : '▶'}</span>
        </div>
        {openCourses && (
          <div className="section-content">
            <div className="folder-item">
              <div className="sub-section-header" onClick={toggleBiology}>
                <span>Biology</span>
                <span>{openBiology ? '▼' : '▶'}</span>
              </div>
              {openBiology && (
                <div className="sub-folder">
                  <div className="folder-item">
                    <div className="sub-section-header" onClick={toggleBioGrades}>
                      <span>Short Notes</span>
                      <span>{openBioGrades ? '▼' : '▶'}</span>
                    </div>
                    {openBioGrades && (
                      <div className="sub-folder">
                        <div className="folder-item">
                          <Link to={`/notes/biology/grade9`} className="navv">Grade 9</Link>
                        </div>
                        <div className="folder-item">
                          <Link to="/notes/biology/grade10" className="navv">Grade 10</Link>
                        </div>
                        <div className="folder-item">
                          <Link to={`/notes/biology/grade11`} className="navv">Grade 11</Link>
                        </div>
                        <div className="folder-item">
                          <Link to={`/notes/biology/grade12`} className="navv">Grade 12</Link>
                        </div>
                      </div>
                    )}
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

            <div className="folder-item">
              <div className="sub-section-header" onClick={toggleChemistry}>
                <span>Chemistry</span>
                <span>{openChemistry ? '▼' : '▶'}</span>
              </div>
              {openChemistry && (
                <div className="sub-folder">
                  <div className="folder-item">
                    <div className="sub-section-header" onClick={toggleChemGrades}>
                      <span>Short Notes</span>
                      <span>{openChemGrades ? '▼' : '▶'}</span>
                    </div>
                    {openChemGrades && (
                      <div className="sub-folder">
                        <div className="folder-item">
                          <Link to={`/notes/chemistry/grade9`} className="navv">Grade 9</Link>
                        </div>
                        <div className="folder-item">
                          <Link to={`/notes/chemistry/grade10`} className="navv">Grade 10</Link>
                        </div>
                        <div className="folder-item">
                          <Link to={`/notes/chemistry/grade11`} className="navv">Grade 11</Link>
                        </div>
                        <div className="folder-item">
                          <Link to={`/notes/chemistry/grade12`} className="navv">Grade 12</Link>
                        </div>
                      </div>
                    )}
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

            <div className="folder-item">
              <div className="sub-section-header" onClick={togglePhysics}>
                <span>Physics</span>
                <span>{openPhysics ? '▼' : '▶'}</span>
              </div>
              {openPhysics && (
                <div className="sub-folder">
                  <div className="folder-item">
                    <div className="sub-section-header" onClick={togglePhysicsGrades}>
                      <span>Short Notes</span>
                      <span>{openPhysicsGrades ? '▼' : '▶'}</span>
                    </div>
                    {openPhysicsGrades && (
                      <div className="sub-folder">
                        <div className="folder-item">
                          <Link to="/notes/physics/grade9" className="navv">Grade 9</Link>
                        </div>
                        <div className="folder-item">
                          <Link to="/notes/physics/grade10" className="navv">Grade 10</Link>
                        </div>
                        <div className="folder-item">
                          <Link to="/notes/physics/grade11" className="navv">Grade 11</Link>
                        </div>
                        <div className="folder-item">
                          <Link to="/notes/physics/grade12" className="navv">Grade 12</Link>
                        </div>
                      </div>
                    )}
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

      <div className="sidebar-section">
        <div className="section-header" onClick={toggleExams}>
          <span>Exams</span>
          <span>{openExams ? '▼' : '▶'}</span>
        </div>
        {openExams && (
          <div className="section-content">
            <div className="folder-item">
              <div className="sub-section-header" onClick={toggleBiologyExams}>
                <span>Biology</span>
                <span>{openBiologyExams ? '▼' : '▶'}</span>
              </div>
              {openBiologyExams && (
                <div className="sub-folder">
                  <div className="folder-item">
                    <Link to="/bioEntrance/2014" className="navv">2014 Exam</Link>
                  </div>
                  <div className="folder-item">
                    <Link to="/bioEntrance/2015" className="navv">2015 Exam</Link>
                  </div>
                  <div className="folder-item">
                    <Link to="/bioEntrance/2016" className="navv">2016 Exam</Link>
                  </div>
                </div>
              )}
            </div>

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

      <div className="sidebar-section">
        <div className="section-header" onClick={toggleQuizzes}>
          <span>Quizzes</span>
          <span>{openQuizzes ? '▼' : '▶'}</span>
        </div>
        {openQuizzes && (
          <div className="section-content">
                          <Link 
                to={{
                  pathname: "/quiz",
                  search: "?subject=Biology&groupByLevel=true"
                }}
                className="folder-item"
              >
                Biology 
              </Link>
                <Link 
                to={{
                  pathname: "/quiz",
                  search: "?subject=Chemistry&groupByLevel=true"
                }}
                className="folder-item"
              >
                Chemistry 
              </Link>
                        <Link 
                to={{
                  pathname: "/quiz",
                  search: "?subject=Physics&groupByLevel=true"
                }}
                className="folder-item"
              >
                Physics
              </Link>
          </div>
        )}
      </div>

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
          <Link to="/chat-rooms" className="logoutt">Goto Chat</Link>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <Link to="/logout" className="logoutt">Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarR;