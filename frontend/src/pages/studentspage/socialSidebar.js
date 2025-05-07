"use client"

import { useState, useEffect, useRef } from "react"
import "../../css/Sidebar.css"
import { Link, useLocation } from "react-router-dom"

// You can replace these with actual icon imports if you have an icon library
const Icons = {
  home: "🏠",
  courses: "📚",
  exams: "📝",
  quizzes: "✅",
  english: "📖",
  mathematics: "➗",
  geography: "🌍",
  history: "📜",
  economics: "💰",
  aptitude: "🧠",
  tips: "💡",
  downloads: "📥",
  chat: "💬",
  logout: "🚪",
  grade: "📊",
  notes: "📝",
  arrow: {
    right: "▶️",
    down: "🔽",
  },
}

const SocialSidebarR = ({ student }) => {
  const location = useLocation()
  const sidebarRef = useRef(null)

  // Define all sections that can be toggled
  const sections = [
    { id: "courses", label: "Study Materials", icon: Icons.courses },
    { id: "exams", label: "Exams", icon: Icons.exams },
    { id: "quizzes", label: "Quizzes", icon: Icons.quizzes },
    { id: "notes", label: "Notes", icon: Icons.notes },
    { id: "english", label: "English", parent: "courses", icon: Icons.english },
    { id: "mathematics", label: "Mathematics", parent: "courses", icon: Icons.mathematics },
    { id: "geography", label: "Geography", parent: "courses", icon: Icons.geography },
    { id: "history", label: "History", parent: "courses", icon: Icons.history },
    { id: "economics", label: "Economics", parent: "courses", icon: Icons.economics },
    { id: "aptitude", label: "Aptitude", parent: "courses", icon: Icons.aptitude },
    { id: "englishExams", label: "English", parent: "exams", icon: Icons.english },
    { id: "mathematicsExams", label: "Mathematics", parent: "exams", icon: Icons.mathematics },
    { id: "geographyExams", label: "Geography", parent: "exams", icon: Icons.geography },
    { id: "historyExams", label: "History", parent: "exams", icon: Icons.history },
    { id: "economicsExams", label: "Economics", parent: "exams", icon: Icons.economics },
    { id: "aptitudeExams", label: "Aptitude", parent: "exams", icon: Icons.aptitude },
    { id: "englishNotes", label: "English", parent: "notes", icon: Icons.english },
    { id: "mathematicsNotes", label: "Mathematics", parent: "notes", icon: Icons.mathematics },
    { id: "geographyNotes", label: "Geography", parent: "notes", icon: Icons.geography },
    { id: "historyNotes", label: "History", parent: "notes", icon: Icons.history },
    { id: "economicsNotes", label: "Economics", parent: "notes", icon: Icons.economics },
    { id: "aptitudeNotes", label: "Aptitude", parent: "notes", icon: Icons.aptitude },
    { id: "englishGrades", label: "English Grades", icon: Icons.grade },
    { id: "mathematicsGrades", label: "Mathematics Grades", icon: Icons.grade },
    { id: "geographyGrades", label: "Geography Grades", icon: Icons.grade },
    { id: "historyGrades", label: "History Grades", icon: Icons.grade },
    { id: "economicsGrades", label: "Economics Grades", icon: Icons.grade },
    { id: "aptitudeGrades", label: "Aptitude Grades", icon: Icons.grade },
  ]

  // Create a state object to track all open/closed states
  const [openSections, setOpenSections] = useState(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: false }), {}),
  )

  // Track active route for highlighting
  const [activeRoute, setActiveRoute] = useState("")

  // Update active route when location changes
  useEffect(() => {
    setActiveRoute(location.pathname)
  }, [location])

  // Helper function to close all dropdowns
  const closeAllDropdowns = () => {
    setOpenSections(sections.reduce((acc, section) => ({ ...acc, [section.id]: false }), {}))
  }

  // Generic toggle function for any section
  const toggleSection = (sectionId) => {
    if (openSections[sectionId]) {
      // If already open, just close it
      setOpenSections((prev) => ({ ...prev, [sectionId]: false }))
    } else {
      // Close all, then open this one and its parent if it has one
      const section = sections.find((s) => s.id === sectionId)
      const newState = sections.reduce((acc, s) => ({ ...acc, [s.id]: false }), {})

      newState[sectionId] = true

      // If this section has a parent, keep it open too
      if (section?.parent) {
        newState[section.parent] = true
      }

      setOpenSections(newState)
    }
  }

  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeAllDropdowns()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  // Check if a section is open
  const isOpen = (sectionId) => openSections[sectionId]

  // Check if a route is active
  const isActive = (path) => activeRoute === path

  // Helper to render grade links
  const renderGradeLinks = (subject) => {
    return [9, 10, 11, 12].map((grade) => {
      const path = `/notes/${subject.toUpperCase()}/grade${grade}`
      return (
        <Link
          key={`${subject}-grade-${grade}`}
          to={path}
          className={`sidebar-r-navv ${isActive(path) ? "active" : ""}`}
        >
          <span className="nav-icon">📘</span>
          Grade {grade}
        </Link>
      )
    })
  }

  // Helper to render exam links
  const renderExamLinks = (subject) => {
    return [2014, 2015, 2016].map((year) => {
      const path = `/entrance/${subject}/${year}`
      return (
        <Link key={`${subject}-exam-${year}`} to={path} className={`sidebar-r-navv ${isActive(path) ? "active" : ""}`}>
          <span className="nav-icon">📄</span>
          {year} Exam
        </Link>
      )
    })
  }

  // Helper to render note links by grade
  const renderNoteLinks = (subject) => {
    const grades = [
      { id: "grade9", label: "Grade 9", icon: "9️⃣" },
      { id: "grade10", label: "Grade 10", icon: "🔟" },
      { id: "grade11", label: "Grade 11", icon: "1️⃣1️⃣" },
      { id: "grade12", label: "Grade 12", icon: "1️⃣2️⃣" },
    ]

    return grades.map((grade) => {
      const path = `/notes/${subject.toLowerCase()}/${grade.id}`
      return (
        <Link
          key={`${subject}-note-${grade.id}`}
          to={path}
          className={`sidebar-r-navv ${isActive(path) ? "active" : ""}`}
        >
          <span className="nav-icon">{grade.icon}</span>
          {grade.label}
        </Link>
      )
    })
  }

  // Add a subtle animation effect
  const getAnimationDelay = (index) => {
    return { animationDelay: `${index * 0.05}s` }
  }

  return (
    <div className="sidebar-r" ref={sidebarRef}>
      <div className="sidebar-r-profile-section">
        <h3>✨ Welcome to EthioAce ✨</h3>
        <p>Your learning journey starts here!</p>
      </div>

      <div className="sidebar-r-section">
        <div className={`sidebar-r-section-header ${isActive(`/socialStudent/${student?._id || "default"}`) ? "active" : ""}`}>
          <Link to={`/socialStudent/${student?._id || "default"}`} className="sidebar-r-navv">
            <span className="nav-icon">{Icons.home}</span>
            Home
          </Link>
        </div>

        <div
          className={`sidebar-r-section-header ${isOpen("courses") ? "active" : ""}`}
          onClick={() => toggleSection("courses")}
          style={getAnimationDelay(1)}
        >
          <span>
            <span className="nav-icon">{Icons.courses}</span>
            Study Materials
          </span>
          <span>{isOpen("courses") ? Icons.arrow.down : Icons.arrow.right}</span>
        </div>

        {isOpen("courses") && (
          <div className="sidebar-r-section-content">
            {/* English Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(2)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("english") ? "active" : ""}`}
                onClick={() => toggleSection("english")}
              >
                <span>
                  <span className="nav-icon">{Icons.english}</span>
                  English
                </span>
                <span>{isOpen("english") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("english") && <div className="sidebar-r-sub-folder">{renderGradeLinks("english")}</div>}
            </div>

            {/* Mathematics Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(3)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("mathematics") ? "active" : ""}`}
                onClick={() => toggleSection("mathematics")}
              >
                <span>
                  <span className="nav-icon">{Icons.mathematics}</span>
                  Mathematics
                </span>
                <span>{isOpen("mathematics") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("mathematics") && <div className="sidebar-r-sub-folder">{renderGradeLinks("mathematics")}</div>}
            </div>

            {/* Geography Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(4)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("geography") ? "active" : ""}`}
                onClick={() => toggleSection("geography")}
              >
                <span>
                  <span className="nav-icon">{Icons.geography}</span>
                  Geography
                </span>
                <span>{isOpen("geography") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("geography") && <div className="sidebar-r-sub-folder">{renderGradeLinks("geography")}</div>}
            </div>

            {/* History Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(5)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("history") ? "active" : ""}`}
                onClick={() => toggleSection("history")}
              >
                <span>
                  <span className="nav-icon">{Icons.history}</span>
                  History
                </span>
                <span>{isOpen("history") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("history") && <div className="sidebar-r-sub-folder">{renderGradeLinks("history")}</div>}
            </div>

            {/* Economics Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(6)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("economics") ? "active" : ""}`}
                onClick={() => toggleSection("economics")}
              >
                <span>
                  <span className="nav-icon">{Icons.economics}</span>
                  Economics
                </span>
                <span>{isOpen("economics") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("economics") && <div className="sidebar-r-sub-folder">{renderGradeLinks("economics")}</div>}
            </div>

            {/* Aptitude Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(7)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("aptitude") ? "active" : ""}`}
                onClick={() => toggleSection("aptitude")}
              >
                <span>
                  <span className="nav-icon">{Icons.aptitude}</span>
                  Aptitude
                </span>
                <span>{isOpen("aptitude") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("aptitude") && <div className="sidebar-r-sub-folder">{renderGradeLinks("aptitude")}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isOpen("notes") ? "active" : ""}`}
          onClick={() => toggleSection("notes")}
          style={getAnimationDelay(8)}
        >
          <span>
            <span className="nav-icon">{Icons.notes}</span>
            Notes
          </span>
          <span>{isOpen("notes") ? Icons.arrow.down : Icons.arrow.right}</span>
        </div>

        {isOpen("notes") && (
          <div className="sidebar-r-section-content">
            {/* English Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(9)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("englishNotes") ? "active" : ""}`}
                onClick={() => toggleSection("englishNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.english}</span>
                  English
                </span>
                <span>{isOpen("englishNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("englishNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("english")}</div>}
            </div>

            {/* Mathematics Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(10)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("mathematicsNotes") ? "active" : ""}`}
                onClick={() => toggleSection("mathematicsNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.mathematics}</span>
                  Mathematics
                </span>
                <span>{isOpen("mathematicsNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("mathematicsNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("mathematics")}</div>}
            </div>

            {/* Geography Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(11)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("geographyNotes") ? "active" : ""}`}
                onClick={() => toggleSection("geographyNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.geography}</span>
                  Geography
                </span>
                <span>{isOpen("geographyNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("geographyNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("geography")}</div>}
            </div>

            {/* History Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(12)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("historyNotes") ? "active" : ""}`}
                onClick={() => toggleSection("historyNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.history}</span>
                  History
                </span>
                <span>{isOpen("historyNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("historyNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("history")}</div>}
            </div>

            {/* Economics Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(13)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("economicsNotes") ? "active" : ""}`}
                onClick={() => toggleSection("economicsNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.economics}</span>
                  Economics
                </span>
                <span>{isOpen("economicsNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("economicsNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("economics")}</div>}
            </div>

            {/* Aptitude Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(14)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("aptitudeNotes") ? "active" : ""}`}
                onClick={() => toggleSection("aptitudeNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.aptitude}</span>
                  Aptitude
                </span>
                <span>{isOpen("aptitudeNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("aptitudeNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("aptitude")}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isOpen("exams") ? "active" : ""}`}
          onClick={() => toggleSection("exams")}
          style={getAnimationDelay(15)}
        >
          <span>
            <span className="nav-icon">{Icons.exams}</span>
            Exams
          </span>
          <span>{isOpen("exams") ? Icons.arrow.down : Icons.arrow.right}</span>
        </div>

        {isOpen("exams") && (
          <div className="sidebar-r-section-content">
            {/* English Exams */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(16)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("englishExams") ? "active" : ""}`}
                onClick={() => toggleSection("englishExams")}
              >
                <span>
                  <span className="nav-icon">{Icons.english}</span>
                  English
                </span>
                <span>{isOpen("englishExams") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("englishExams") && <div className="sidebar-r-sub-folder">{renderExamLinks("English")}</div>}
            </div>

            {/* Mathematics Exams */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(17)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("mathematicsExams") ? "active" : ""}`}
                onClick={() => toggleSection("mathematicsExams")}
              >
                <span>
                  <span className="nav-icon">{Icons.mathematics}</span>
                  Mathematics
                </span>
                <span>{isOpen("mathematicsExams") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("mathematicsExams") && <div className="sidebar-r-sub-folder">{renderExamLinks("Mathematics")}</div>}
            </div>

            {/* Geography Exams */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(18)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("geographyExams") ? "active" : ""}`}
                onClick={() => toggleSection("geographyExams")}
              >
                <span>
                  <span className="nav-icon">{Icons.geography}</span>
                  Geography
                </span>
                <span>{isOpen("geographyExams") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("geographyExams") && <div className="sidebar-r-sub-folder">{renderExamLinks("Geography")}</div>}
            </div>

            {/* History Exams */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(19)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("historyExams") ? "active" : ""}`}
                onClick={() => toggleSection("historyExams")}
              >
                <span>
                  <span className="nav-icon">{Icons.history}</span>
                  History
                </span>
                <span>{isOpen("historyExams") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("historyExams") && <div className="sidebar-r-sub-folder">{renderExamLinks("History")}</div>}
            </div>

            {/* Economics Exams */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(20)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("economicsExams") ? "active" : ""}`}
                onClick={() => toggleSection("economicsExams")}
              >
                <span>
                  <span className="nav-icon">{Icons.economics}</span>
                  Economics
                </span>
                <span>{isOpen("economicsExams") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("economicsExams") && <div className="sidebar-r-sub-folder">{renderExamLinks("Economics")}</div>}
            </div>

            {/* Aptitude Exams */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(21)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("aptitudeExams") ? "active" : ""}`}
                onClick={() => toggleSection("aptitudeExams")}
              >
                <span>
                  <span className="nav-icon">{Icons.aptitude}</span>
                  Aptitude
                </span>
                <span>{isOpen("aptitudeExams") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("aptitudeExams") && <div className="sidebar-r-sub-folder">{renderExamLinks("Aptitude")}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isOpen("quizzes") ? "active" : ""}`}
          onClick={() => toggleSection("quizzes")}
          style={getAnimationDelay(22)}
        >
          <span>
            <span className="nav-icon">{Icons.quizzes}</span>
            Quizzes
          </span>
          <span>{isOpen("quizzes") ? Icons.arrow.down : Icons.arrow.right}</span>
        </div>

        {isOpen("quizzes") && (
          <div className="sidebar-r-section-content">
            {["English", "Mathematics", "Geography", "History", "Economics", "Aptitude"].map((subject, index) => {
              const icon =
                subject === "English" ? Icons.english :
                subject === "Mathematics" ? Icons.mathematics :
                subject === "Geography" ? Icons.geography :
                subject === "History" ? Icons.history :
                subject === "Economics" ? Icons.economics :
                Icons.aptitude
              return (
                <Link
                  key={`quiz-${subject}`}
                  to={{
                    pathname: "/quiz",
                    search: `?subject=${subject}&groupByLevel=true`,
                  }}
                  className="sidebar-r-folder-item"
                  style={getAnimationDelay(23 + index)}
                >
                  <span className="nav-icon">{icon}</span>
                  {subject}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isActive(`/socialStudent/${student?._id || "default"}/tips`) ? "active" : ""}`}
          style={getAnimationDelay(29)}
        >
          <Link to={`/socialStudent/${student?._id || "default"}/tips`} className="sidebar-r-navv" onClick={closeAllDropdowns}>
            <span className="nav-icon">{Icons.tips}</span>
            Tips & Tricks
          </Link>
        </div>
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header" style={getAnimationDelay(30)}>
          <span>
            <span className="nav-icon">{Icons.downloads}</span>
            Downloads
          </span>
        </div>
      </div>

      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isActive("/chat-rooms") ? "active" : ""}`}
          style={getAnimationDelay(31)}
        >
          <Link to="/chat-rooms" className="sidebar-r-navv">
            <span className="nav-icon">{Icons.chat}</span>
            Study Chat
          </Link>
        </div>
      </div>

      <div className="sidebar-r-section" style={{ marginTop: "auto" }}>
        <Link to="/logout" className="sidebar-r-logoutt">
          <span className="nav-icon">{Icons.logout}</span>
          Logout
        </Link>
      </div>
    </div>
  )
}

export default SocialSidebarR