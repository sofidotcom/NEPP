"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import "../../css/notesBySubject.css"
import SidebarR from "../studentspage/studentSideBar"
import { Menu } from "lucide-react"

const NotesBySubject = () => {
  const { subject, grade } = useParams()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChapter, setActiveChapter] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const chapterRefs = useRef({})

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const gradeValue = grade?.replace(/\D/g, "")
        console.log(`Fetching notes with subject=${subject} and grade=${gradeValue}`)
        const response = await axios.get(`/api/v1/notes?subject=${subject}&grade=${gradeValue}`)
        console.log("API Response:", response.data)

        const notesData = response.data
        setNotes(notesData)

        if (notesData.length > 0) {
          const chapters = [...new Set(notesData.map((note) => note.chapter))].sort((a, b) => Number(a) - Number(b))
          if (chapters.length > 0) {
            setActiveChapter(chapters[0])
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching notes:", error)
        setError("Failed to fetch notes. Please try again later.")
        setLoading(false)
      }
    }

    fetchNotes()
  }, [subject, grade])

  const groupNotesByChapter = (notes) => {
    const grouped = {}
    notes.forEach((note) => {
      if (!grouped[note.chapter]) {
        grouped[note.chapter] = []
      }
      grouped[note.chapter].push(note)
    })

    return Object.keys(grouped)
      .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10))
      .map((chapter) => ({
        chapter,
        notes: grouped[chapter],
      }))
  }

  const navigateChapter = (currentChapter, direction) => {
    const chapters = groupedNotes.map((group) => group.chapter)
    const currentIndex = chapters.indexOf(currentChapter)

    let targetIndex
    if (direction === "next" && currentIndex < chapters.length - 1) {
      targetIndex = currentIndex + 1
    } else if (direction === "prev" && currentIndex > 0) {
      targetIndex = currentIndex - 1
    } else {
      return
    }

    const targetChapter = chapters[targetIndex]
    setActiveChapter(targetChapter)

    setTimeout(() => {
      const navButtons = document.querySelectorAll(".ns-chapter-navigation .ns-nav-button")
      if (navButtons.length) {
        navButtons[0].focus()
      }
    }, 100)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedNotes = groupNotesByChapter(filteredNotes)

  if (loading) {
    return <div className="ns-loading">Loading...</div>
  }

  if (error) {
    return <div className="ns-error">{error}</div>
  }

  const displayGrade = grade?.replace(/\D/g, "") || ""

  return (
    <div className={`ns-page-container ${sidebarOpen ? "ns-sidebar-open" : ""}`}>
      {/* Mobile sidebar toggle */}
      <button className="ns-sidebar-toggle" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      {/* <SidebarR /> */}

      <div className="ns-notes-container">
        <div className="ns-search-bar">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <h2>
            {subject} - Grade {displayGrade} Notes
          </h2>
        </div>

        {groupedNotes.length === 0 ? (
          <p className="ns-no-notes">
            No notes found for {subject} Grade {displayGrade}.
          </p>
        ) : (
          <div className="ns-notes-by-chapter">
            {groupedNotes.map((chapterGroup) => (
              <div
                className={`ns-chapter-section ${activeChapter === chapterGroup.chapter ? "ns-active-chapter" : "ns-hidden-chapter"}`}
                key={chapterGroup.chapter}
                ref={(el) => (chapterRefs.current[chapterGroup.chapter] = el)}
                id={`chapter-${chapterGroup.chapter}`}
              >
                <h3 className="ns-chapter-heading">Chapter {chapterGroup.chapter}</h3>
                <div className="ns-notes-list">
                  {chapterGroup.notes.map((note) => (
                    <div className="ns-note-card" key={note._id}>
                      <h3 className="ns-note-title">#{note.title}</h3>
                      <p className="ns-note-description">{note.description}</p>
                    </div>
                  ))}
                </div>
                <div className="ns-chapter-navigation">
                  <button
                    className={`ns-nav-button ns-prev ${groupedNotes.findIndex((g) => g.chapter === chapterGroup.chapter) === 0 ? "ns-disabled" : ""}`}
                    onClick={() => navigateChapter(chapterGroup.chapter, "prev")}
                    disabled={groupedNotes.findIndex((g) => g.chapter === chapterGroup.chapter) === 0}
                  >
                    ← Previous Chapter
                  </button>
                  <span className="ns-chapter-indicator">Chapter {chapterGroup.chapter}</span>
                  <button
                    className={`ns-nav-button ns-next ${groupedNotes.findIndex((g) => g.chapter === chapterGroup.chapter) === groupedNotes.length - 1 ? "ns-disabled" : ""}`}
                    onClick={() => navigateChapter(chapterGroup.chapter, "next")}
                    disabled={
                      groupedNotes.findIndex((g) => g.chapter === chapterGroup.chapter) === groupedNotes.length - 1
                    }
                  >
                    Next Chapter →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesBySubject






