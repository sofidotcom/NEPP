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
  biology: "🧬",
  chemistry: "⚗️",
  physics: "⚛️",
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

const SidebarR = ({ student }) => {
  const location = useLocation()
  const sidebarRef = useRef(null)

  // Define all sections that can be toggled
  const sections = [
    { id: "courses", label: "Study Materials", icon: Icons.courses },
    { id: "exams", label: "Exams", icon: Icons.exams },
    { id: "quizzes", label: "Quizzes", icon: Icons.quizzes },
    { id: "notes", label: "Notes", icon: Icons.notes },
    { id: "biology", label: "Biology", parent: "courses", icon: Icons.biology },
    { id: "chemistry", label: "Chemistry", parent: "courses", icon: Icons.chemistry },
    { id: "physics", label: "Physics", parent: "courses", icon: Icons.physics },
    { id: "biologyExams", label: "Biology", parent: "exams", icon: Icons.biology },
    { id: "chemistryExams", label: "Chemistry", parent: "exams", icon: Icons.chemistry },
    { id: "biologyNotes", label: "Biology", parent: "notes", icon: Icons.biology },
    { id: "chemistryNotes", label: "Chemistry", parent: "notes", icon: Icons.chemistry },
    { id: "physicsNotes", label: "Physics", parent: "notes", icon: Icons.physics },
    { id: "bioGrades", label: "Biology Grades", icon: Icons.grade },
    { id: "chemGrades", label: "Chemistry Grades", icon: Icons.grade },
    { id: "physicsGrades", label: "Physics Grades", icon: Icons.grade },
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

  // MODIFIED: Helper to render note links by grade instead of by type
  const renderNoteLinks = (subject) => {
    // Changed from note types to grade levels
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
        <div className={`sidebar-r-section-header ${isActive("/student/68062373424518fedf2fd0e2") ? "active" : ""}`}>
          <Link to={`/student/id`} className="sidebar-r-navv">
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
            {/* Biology Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(2)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("biology") ? "active" : ""}`}
                onClick={() => toggleSection("biology")}
              >
                <span>
                  <span className="nav-icon">{Icons.biology}</span>
                  Biology
                </span>
                <span>{isOpen("biology") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("biology") && <div className="sidebar-r-sub-folder">{renderGradeLinks("biology")}</div>}
            </div>

            {/* Chemistry Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(3)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("chemistry") ? "active" : ""}`}
                onClick={() => toggleSection("chemistry")}
              >
                <span>
                  <span className="nav-icon">{Icons.chemistry}</span>
                  Chemistry
                </span>
                <span>{isOpen("chemistry") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("chemistry") && <div className="sidebar-r-sub-folder">{renderGradeLinks("chemistry")}</div>}
            </div>

            {/* Physics Section */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(4)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("physics") ? "active" : ""}`}
                onClick={() => toggleSection("physics")}
              >
                <span>
                  <span className="nav-icon">{Icons.physics}</span>
                  Physics
                </span>
                <span>{isOpen("physics") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("physics") && <div className="sidebar-r-sub-folder">{renderGradeLinks("physics")}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Notes Section - Modified to use grade-based organization */}
      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isOpen("notes") ? "active" : ""}`}
          onClick={() => toggleSection("notes")}
          style={getAnimationDelay(4.5)}
        >
          <span>
            <span className="nav-icon">{Icons.notes}</span>
            Notes
          </span>
          <span>{isOpen("notes") ? Icons.arrow.down : Icons.arrow.right}</span>
        </div>

        {isOpen("notes") && (
          <div className="sidebar-r-section-content">
            {/* Biology Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(4.6)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("biologyNotes") ? "active" : ""}`}
                onClick={() => toggleSection("biologyNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.biology}</span>
                  Biology
                </span>
                <span>{isOpen("biologyNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("biologyNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("biology")}</div>}
            </div>

            {/* Chemistry Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(4.7)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("chemistryNotes") ? "active" : ""}`}
                onClick={() => toggleSection("chemistryNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.chemistry}</span>
                  Chemistry
                </span>
                <span>{isOpen("chemistryNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("chemistryNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("chemistry")}</div>}
            </div>

            {/* Physics Notes */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(4.8)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("physicsNotes") ? "active" : ""}`}
                onClick={() => toggleSection("physicsNotes")}
              >
                <span>
                  <span className="nav-icon">{Icons.physics}</span>
                  Physics
                </span>
                <span>{isOpen("physicsNotes") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("physicsNotes") && <div className="sidebar-r-sub-folder">{renderNoteLinks("physics")}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isOpen("exams") ? "active" : ""}`}
          onClick={() => toggleSection("exams")}
          style={getAnimationDelay(5)}
        >
          <span>
            <span className="nav-icon">{Icons.exams}</span>
            Exams
          </span>
          <span>{isOpen("exams") ? Icons.arrow.down : Icons.arrow.right}</span>
        </div>

        {isOpen("exams") && (
          <div className="sidebar-r-section-content">
            {/* Biology Exams */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(6)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("biologyExams") ? "active" : ""}`}
                onClick={() => toggleSection("biologyExams")}
              >
                <span>
                  <span className="nav-icon">{Icons.biology}</span>
                  Biology
                </span>
                <span>{isOpen("biologyExams") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("biologyExams") && <div className="sidebar-r-sub-folder">{renderExamLinks("Biology")}</div>}
            </div>

            {/* Chemistry Exams */}
            <div className="sidebar-r-folder-item" style={getAnimationDelay(7)}>
              <div
                className={`sidebar-r-sub-section-header ${isOpen("chemistryExams") ? "active" : ""}`}
                onClick={() => toggleSection("chemistryExams")}
              >
                <span>
                  <span className="nav-icon">{Icons.chemistry}</span>
                  Chemistry
                </span>
                <span>{isOpen("chemistryExams") ? Icons.arrow.down : Icons.arrow.right}</span>
              </div>
              {isOpen("chemistryExams") && <div className="sidebar-r-sub-folder">{renderExamLinks("Chemistry")}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isOpen("quizzes") ? "active" : ""}`}
          onClick={() => toggleSection("quizzes")}
          style={getAnimationDelay(8)}
        >
          <span>
            <span className="nav-icon">{Icons.quizzes}</span>
            Quizzes
          </span>
          <span>{isOpen("quizzes") ? Icons.arrow.down : Icons.arrow.right}</span>
        </div>

        {isOpen("quizzes") && (
          <div className="sidebar-r-section-content">
            {["Biology", "Chemistry", "Physics"].map((subject, index) => {
              const icon =
                subject === "Biology" ? Icons.biology : subject === "Chemistry" ? Icons.chemistry : Icons.physics
              return (
                <Link
                  key={`quiz-${subject}`}
                  to={{
                    pathname: "/quiz",
                    search: `?subject=${subject}&groupByLevel=true`,
                  }}
                  className="sidebar-r-folder-item"
                  style={getAnimationDelay(9 + index)}
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
          className={`sidebar-r-section-header ${isActive(`/student/${student?.id || "default"}/tips`) ? "active" : ""}`}
          style={getAnimationDelay(12)}
        >
          <Link to={`/student/${student?.id || "default"}/tips`} className="sidebar-r-navv" onClick={closeAllDropdowns}>
            <span className="nav-icon">{Icons.tips}</span>
            Tips & Tricks
          </Link>
        </div>
      </div>

      <div className="sidebar-r-section">
        <div className="sidebar-r-section-header" style={getAnimationDelay(13)}>
          <span>
            <span className="nav-icon">{Icons.downloads}</span>
            Downloads
          </span>
        </div>
      </div>

      <div className="sidebar-r-section">
        <div
          className={`sidebar-r-section-header ${isActive("/chat-rooms") ? "active" : ""}`}
          style={getAnimationDelay(14)}
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

export default SidebarR
