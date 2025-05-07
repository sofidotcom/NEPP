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

 useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const response = await fetch('/api/v1/top-performers')
        if (!response.ok) throw new Error('Failed to fetch top performers')
        const data = await response.json()
        setTopPerformers(data)
      } catch (error) {
        console.error("Error fetching top performers:", error)
        setTopPerformers({})
      }
    }
    fetchTopPerformers()
  }, [])

  // Handle animation sequence with repeating loop
  useEffect(() => {
    if (topPerformers && Object.keys(topPerformers).length > 0) {
      const years = ['2014', '2015', '2016', 'overall']
      let index = 0
      const interval = setInterval(() => {
        setCurrentDisplay(years[index])
        index = (index + 1) % years.length // Loop back to 0 when reaching the end
      }, 6000) // 6 seconds per display
      return () => clearInterval(interval)
    }
  }, [topPerformers])

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  // Medal icons based on rank
  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1: return <i className="fas fa-medal" style={{ color: 'gold' }}></i>;
      case 2: return <i className="fas fa-medal" style={{ color: 'silver' }}></i>;
      case 3: return <i className="fas fa-medal" style={{ color: '#cd7f32' }}></i>;
      default: return null;
    }
  }
{/* Top Performers Section */}
        <div className="top-performers-section">
          <h2>Our Top Performers</h2>
          <div className="performers-container">
            {topPerformers && Object.keys(topPerformers).length > 0 ? (
              <>
                {currentDisplay === '2014' && topPerformers['2014'] && (
                  <div className="performer-card animate">
                    <h3>Top Performers of 2014</h3>
                    {topPerformers['2014'].map((performer) => (
                      <div key={performer.rank} className="performer-item">
                        <p>{getMedalIcon(performer.rank)} Rank {performer.rank}: {performer.name}</p>
                        <p>Score: {performer.totalScore}/{performer.totalPossible}</p>
                      </div>
                    ))}
                  </div>
                )}
                {currentDisplay === '2015' && topPerformers['2015'] && (
                  <div className="performer-card animate">
                    <h3>Top Performers of 2015</h3>
                    {topPerformers['2015'].map((performer) => (
                      <div key={performer.rank} className="performer-item">
                        <p>{getMedalIcon(performer.rank)} Rank {performer.rank}: {performer.name}</p>
                        <p>Score: {performer.totalScore}/{performer.totalPossible}</p>
                      </div>
                    ))}
                  </div>
                )}
                {currentDisplay === '2016' && topPerformers['2016'] && (
                  <div className="performer-card animate">
                    <h3>Top Performers of 2016</h3>
                    {topPerformers['2016'].map((performer) => (
                      <div key={performer.rank} className="performer-item">
                        <p>{getMedalIcon(performer.rank)} Rank {performer.rank}: {performer.name}</p>
                        <p>Score: {performer.totalScore}/{performer.totalPossible}</p>
                      </div>
                    ))}
                  </div>
                )}
                {currentDisplay === 'overall' && topPerformers.overall && (
                  <div className="performer-card animate">
                    <h3>All-Time Top Performers</h3>
                    {topPerformers.overall.map((performer) => (
                      <div key={performer.rank} className="performer-item">
                        <p>{getMedalIcon(performer.rank)} Rank {performer.rank}: {performer.name}</p>
                        <p>Score: {performer.totalScore}/{performer.totalPossible}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p>No top performers data available.</p>
            )}
          </div>
        </div>