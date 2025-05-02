import React, { useState } from 'react';
import '../../css/Sidebar.css';
import { Link } from 'react-router-dom';

const SidebarR = ({ student }) => {
  const [dropdowns, setDropdowns] = useState({
    courses: false,
    exams: false,
    quizzes: false,
    biology: false,
    chemistry: false,
    physics: false,
    bioGrades: false,
    chemGrades: false,
    physicsGrades: false,
    biologyExams: false,
    chemistryExams: false,
  });

  const toggleSection = (section, isMainSection = false) => {
    setDropdowns((prev) => {
      const newState = { ...prev };
      
      if (isMainSection) {
        // Close all main sections and their sub-sections
        const mainSections = ['courses', 'exams', 'quizzes','notes'];
        const subSections = [
          'biology', 'chemistry', 'physics','English','Civics and Ethics','Mathematics','Chemistry',
          'bioGrades', 'chemGrades', 'physicsGrades',
          'biologyExams', 'chemistryExams'
        ];
        mainSections.forEach((main) => {
          newState[main] = main === section ? !prev[main] : false;
        });
        // Close sub-sections only for other main sections
        if (!newState[section]) {
          subSections.forEach((sub) => {
            newState[sub] = false;
          });
        }
      } else {
        // Toggle sub-section without affecting main sections
        newState[section] = !prev[section];
      }
      
      return newState;
    });
  };

  // Reusable component for subject dropdowns
  const SubjectDropdown = ({ subject, openState, gradesState, toggleOpen, toggleGrades }) => (
    <div className="sidebar-r-folder-item">
      <div
        className={`sidebar-r-sub-section-header ${openState ? 'active' : ''}`}
        onClick={() => toggleSection(toggleOpen)}
      >
        <span>{subject}</span>

        <span>{dropdowns[toggleOpen] ? '▼' : '▶'}</span>
      </div>
      {dropdowns[toggleOpen] && (
        <div className="sidebar-r-sub-folder">
                <Link to={`/notes/${subject.toLowerCase()}/grade9`} className="sidebar-r-navv">Grade 9</Link>
                <Link to={`/notes/${subject.toLowerCase()}/grade10`} className="sidebar-r-navv">Grade 10</Link>
                <Link to={`/notes/${subject.toLowerCase()}/grade11`} className="sidebar-r-navv">Grade 11</Link>
                <Link to={`/notes/${subject.toLowerCase()}/grade12`} className="sidebar-r-navv">Grade 12</Link>
                  </div>
      )}

        
          </div>
  );

  // Reusable component for exam dropdowns
  const ExamDropdown = ({ subject, openState, toggleOpen }) => (
    <div className="sidebar-r-folder-item">
      <div
        className={`sidebar-r-sub-section-header ${openState ? 'active' : ''}`}
        onClick={() => toggleSection(toggleOpen)}
      >
        <span>{subject}</span>
        <span>{dropdowns[toggleOpen] ? '▼' : '▶'}</span>
      </div>
      {dropdowns[toggleOpen] && (
        <div className="sidebar-r-sub-folder">
          <Link to={`/`} className="sidebar-r-navv">2014 Exam</Link>
          <Link to={`/entrance/${subject}/2015`} className="sidebar-r-navv">2015 Exam</Link>
          <Link to={`/entrance/${subject}/2016`} className="sidebar-r-navv">2016 Exam</Link>
        </div>
      )}
    </div>
  );

  const NoteDropdown = ({ subject, openState, toggleOpen }) => (
    <div className="sidebar-r-folder-item">
      <div
        className={`sidebar-r-sub-section-header ${openState ? 'active' : ''}`}
        onClick={() => toggleSection(toggleOpen)}
      >
        <span>{subject}</span>
        <span>{dropdowns[toggleOpen] ? '▼' : '▶'}</span>
      </div>
      {dropdowns[toggleOpen] && (
        <div className="sidebar-r-sub-folder">
                <Link to={`/notes/${subject.toLowerCase()}/grade9`} className="sidebar-r-navv">Grade 9</Link>
                <Link to={`/notes/${subject.toLowerCase()}/grade10`} className="sidebar-r-navv">Grade 10</Link>
                <Link to={`/notes/${subject.toLowerCase()}/grade11`} className="sidebar-r-navv">Grade 11</Link>
                <Link to={`/notes/${subject.toLowerCase()}/grade12`} className="sidebar-r-navv">Grade 12</Link>
        </div>
      )}
    </div>
  );
  return (
    <div className="sidebar-r">
      <div className="sidebar-r-profile-section">
        
        <h3>Welcome to EthioAce, {student.name}</h3>
      </div>

      {/* Home */}
      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">Home</div>
      </div>

      {/* Courses */}
      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${dropdowns.courses ? 'active' : ''}`}
          onClick={() => toggleSection('courses', true)}
        >
          <span>Study materials</span>
          <span>{dropdowns.courses ? '▼' : '▶'}</span>
        </div>
        {dropdowns.courses && (
          <div className="sidebar-r-section-content">
            <SubjectDropdown
              subject="Biology"
              openState={dropdowns.biology}
              gradesState={dropdowns.bioGrades}
              toggleOpen="biology"
              toggleGrades="bioGrades"
            />
            <SubjectDropdown
              subject="Chemistry"
              openState={dropdowns.chemistry}
              gradesState={dropdowns.chemGrades}
              toggleOpen="chemistry"
              toggleGrades="chemGrades"
            />
            <SubjectDropdown
              subject="Physics"
              openState={dropdowns.physics}
              gradesState={dropdowns.physicsGrades}
              toggleOpen="physics"
              toggleGrades="physicsGrades"
            />
             <SubjectDropdown
              subject="Aptitude"
              openState={dropdowns.aptitude}
              gradesState={dropdowns.physicsGrades}
              toggleOpen="physics"
              toggleGrades="physicsGrades"
            />
             <SubjectDropdown
              subject="English"
              openState={dropdowns.endlish}
              gradesState={dropdowns.physicsGrades}
              toggleOpen="physics"
              toggleGrades="physicsGrades"
            />
             <SubjectDropdown
              subject="Civics and Ethics"
              openState={dropdowns.civics}
              gradesState={dropdowns.physicsGrades}
              toggleOpen="physics"
              toggleGrades="physicsGrades"
            />
             <SubjectDropdown
              subject="Mathematics"
              openState={dropdowns.physics}
              gradesState={dropdowns.physicsGrades}
              toggleOpen="physics"
              toggleGrades="physicsGrades"
            />
          </div>
        )}
      </div>

      {/* Exams */}
      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${dropdowns.exams ? 'active' : ''}`}
          onClick={() => toggleSection('exams', true)}
        >
          <span>Exams</span>
          <span>{dropdowns.exams ? '▼' : '▶'}</span>
        </div>
        {dropdowns.exams && (
          <div className="sidebar-r-section-content">
            <ExamDropdown subject="Biology" openState={dropdowns.biologyExams} toggleOpen="biologyExams" />
            <ExamDropdown subject="Chemistry" openState={dropdowns.chemistryExams} toggleOpen="chemistryExams" />
          </div>
        )}
      </div>

      {/* notes */}

      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${dropdowns.note ? 'active' : ''}`}
          onClick={() => toggleSection('exams', true)}
        >
          <span>Notes</span>
          <span>{dropdowns.note ? '▼' : '▶'}</span>
        </div>
        {dropdowns.note && (
          <div className="sidebar-r-section-content">
            <NoteDropdown subject="Biology" openState={dropdowns.biologyExams} toggleOpen="biologyExams" />
            <NoteDropdown subject="Chemistry" openState={dropdowns.chemistryExams} toggleOpen="chemistryExams" />
          </div>
        )}
      </div>

      {/* Quizzes */}
      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${dropdowns.quizzes ? 'active' : ''}`}
          onClick={() => toggleSection('quizzes', true)}
        >
          <span>Quizzes</span>
          <span>{dropdowns.quizzes ? '▼' : '▶'}</span>
        </div>
        {dropdowns.quizzes && (
          <div className="sidebar-r-section-content">
            <Link
              to={{ pathname: "/quiz", search: "?subject=Biology&groupByLevel=true" }}
              className="sidebar-r-folder-item"
            >
              Biology
            </Link>
            <Link
              to={{ pathname: "/quiz", search: "?subject=Chemistry&groupByLevel=true" }}
              className="sidebar-r-folder-item"
            >
              Chemistry
            </Link>
            <Link
              to={{ pathname: "/quiz", search: "?subject=Physics&groupByLevel=true" }}
              className="sidebar-r-folder-item"
            >
              Physics
            </Link>
          </div>
        )}
      </div>

      {/* Static Sections */}
      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">Tips</div>
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">Downloads</div>
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header">
          <Link to="/chat-rooms" className="sidebar-r-logoutt">Goto Chat</Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarR;