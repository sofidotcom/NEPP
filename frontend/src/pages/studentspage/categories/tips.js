"use client"

import { useState, useEffect } from "react"
import SidebarR from "../studentSideBar"
import "../../../css/tipsPage.css"
import { motion } from "framer-motion"
import { Search, BookOpen, Award, Clock, ChevronRight, Filter, ArrowUp } from 'lucide-react'

// Sample tips data - in a real app, this would come from an API
const tipsData = [
  {
    id: 1,
    title: "How to Memorize Chemical Formulas",
    category: "Chemistry",
    difficulty: "Medium",
    timeToRead: "5 min",
    content:
      "Create associations between elements and their symbols. For example, think of Sodium (Na) as 'Not a' to remember it's Na, not So. Use flashcards with the formula on one side and the name on the other.",
    featured: true,
    likes: 245,
    date: "2023-05-15",
  },
  {
    id: 2,
    title: "Effective Biology Diagrams",
    category: "Biology",
    difficulty: "Easy",
    timeToRead: "3 min",
    content:
      "When drawing biological diagrams, always use a pencil first, then outline with pen. Label parts with straight lines, never crossing lines. Use a ruler for professional results.",
    featured: true,
    likes: 189,
    date: "2023-06-22",
  },
  {
    id: 3,
    title: "Physics Problem-Solving Framework",
    category: "Physics",
    difficulty: "Hard",
    timeToRead: "8 min",
    content:
      "Follow these steps: 1) Identify known and unknown variables, 2) Select relevant equations, 3) Solve algebraically before plugging in numbers, 4) Check units for consistency, 5) Verify if the answer makes physical sense.",
    featured: false,
    likes: 312,
    date: "2023-04-10",
  },
  {
    id: 4,
    title: "Mastering Multiple Choice Questions",
    category: "Exam Strategies",
    difficulty: "Medium",
    timeToRead: "6 min",
    content:
      "For multiple choice questions, eliminate obviously wrong answers first. If still unsure, look for qualifiers like 'always' or 'never' which often indicate incorrect options. Trust your first instinct unless you're certain it's wrong.",
    featured: true,
    likes: 427,
    date: "2023-07-05",
  },
  {
    id: 5,
    title: "Creating Effective Study Notes",
    category: "Study Skills",
    difficulty: "Easy",
    timeToRead: "4 min",
    content:
      "Use the Cornell note-taking system: divide your page into sections for notes, cues, and summary. Write main ideas and keywords in the cue column, detailed notes in the notes section, and summarize at the bottom.",
    featured: false,
    likes: 156,
    date: "2023-08-12",
  },
  {
    id: 6,
    title: "Memory Palace Technique",
    category: "Study Skills",
    difficulty: "Medium",
    timeToRead: "7 min",
    content:
      "Create a mental journey through a familiar place (like your home) and associate each location with information you need to remember. To recall, mentally walk through your 'palace' and retrieve the information at each location.",
    featured: false,
    likes: 203,
    date: "2023-03-28",
  },
  {
    id: 7,
    title: "Understanding Acid-Base Reactions",
    category: "Chemistry",
    difficulty: "Hard",
    timeToRead: "10 min",
    content:
      "Remember that acids donate H+ ions (protons) while bases accept them. The strength of an acid depends on how readily it donates these protons. Use the pH scale as a quick reference: below 7 is acidic, above 7 is basic.",
    featured: false,
    likes: 178,
    date: "2023-09-03",
  },
  {
    id: 8,
    title: "Effective Time Management for Exams",
    category: "Exam Strategies",
    difficulty: "Medium",
    timeToRead: "5 min",
    content:
      "Allocate time based on mark value. For a 3-hour exam with 100 marks, each mark is worth about 1.8 minutes. Quickly review the entire exam first, then tackle questions you're most confident about to build momentum.",
    featured: true,
    likes: 392,
    date: "2023-02-17",
  },
  {
    id: 9,
    title: "Memorizing the Periodic Table",
    category: "Chemistry",
    difficulty: "Hard",
    timeToRead: "12 min",
    content:
      "Focus on patterns rather than memorizing each element. Learn the groups (columns) and their properties. Create mnemonics for the first 20 elements. Use online interactive periodic tables for practice.",
    featured: false,
    likes: 265,
    date: "2023-07-29",
  },
  {
    id: 10,
    title: "Understanding Cellular Respiration",
    category: "Biology",
    difficulty: "Hard",
    timeToRead: "9 min",
    content:
      "Break down the process into three main stages: glycolysis, Krebs cycle, and electron transport chain. Focus on where ATP is produced in each stage. Use diagrams to visualize the process happening in the cell.",
    featured: false,
    likes: 231,
    date: "2023-05-11",
  },
  {
    id: 11,
    title: "Solving Vector Problems",
    category: "Physics",
    difficulty: "Medium",
    timeToRead: "7 min",
    content:
      "Always draw a diagram first. Break vectors into components using sine and cosine. Remember that vector addition can be done graphically (tip-to-tail method) or algebraically (adding components).",
    featured: false,
    likes: 187,
    date: "2023-08-04",
  },
  {
    id: 12,
    title: "Effective Flashcard Techniques",
    category: "Study Skills",
    difficulty: "Easy",
    timeToRead: "4 min",
    content:
      "Keep flashcards simple with one concept per card. Use spaced repetition: review cards at increasing intervals. Include diagrams and colors for visual memory. Test yourself in both directions.",
    featured: true,
    likes: 304,
    date: "2023-04-22",
  },
]

// Categories with their respective icons
const categories = [
  { name: "All", icon: "🌟" },
  { name: "Biology", icon: "🧬" },
  { name: "Chemistry", icon: "⚗️" },
  { name: "Physics", icon: "⚛️" },
  { name: "Study Skills", icon: "📚" },
  { name: "Exam Strategies", icon: "📝" },
]

// Difficulty levels with colors
const difficultyColors = {
  Easy: "#4ade80", // green
  Medium: "#f59e0b", // amber
  Hard: "#ef4444", // red
}

const TipsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTips, setFilteredTips] = useState(tipsData)
  const [sortBy, setSortBy] = useState("featured") // featured, newest, popular
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Filter tips based on category and search term
  useEffect(() => {
    let filtered = tipsData

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((tip) => tip.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tip) =>
          tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tip.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort tips
    if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (sortBy === "popular") {
      filtered = [...filtered].sort((a, b) => b.likes - a.likes)
    } else {
      // featured
      filtered = [...filtered].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    }

    setFilteredTips(filtered)
  }, [selectedCategory, searchTerm, sortBy])

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <div className="tips-page-container">
      <SidebarR student={{ id: "68062373424518fedf2fd0e2" }} />
      
      <main className="tips-content">
        <div className="tips-header">
          <h1>Study Tips & Tricks</h1>
          <p>Discover strategies to enhance your learning and ace your exams</p>
        </div>

        <div className="tips-search-bar">
          <div className="search-input-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search for tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sort-container">
            <Filter size={16} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="tips-categories">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-button ${selectedCategory === category.name ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {filteredTips.length === 0 ? (
          <div className="no-tips-found">
            <h3>No tips found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <motion.div
            className="tips-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredTips.map((tip) => (
              <motion.div key={tip.id} className="tip-card" variants={itemVariants}>
                {tip.featured && <div className="featured-badge">Featured</div>}
                <div className="tip-header">
                  <div className="tip-meta">
                    <span className="tip-category">{tip.category}</span>
                    <span
                      className="tip-difficulty"
                      style={{ backgroundColor: difficultyColors[tip.difficulty] }}
                    >
                      {tip.difficulty}
                    </span>
                  </div>
                  <div className="tip-time">
                    <Clock size={14} />
                    <span>{tip.timeToRead}</span>
                  </div>
                </div>
                <h3 className="tip-title">{tip.title}</h3>
                <p className="tip-content">{tip.content}</p>
                <div className="tip-footer">
                  <div className="tip-likes">
                    <Award size={16} />
                    <span>{tip.likes} students found this helpful</span>
                  </div>
                  <button className="read-more-btn">
                    Read more <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {showScrollTop && (
          <button className="scroll-top-button" onClick={scrollToTop}>
            <ArrowUp size={20} />
          </button>
        )}

        <div className="tips-footer">
          <div className="tips-footer-content">
            <h3>Want to contribute?</h3>
            <p>Share your own study tips and help other students succeed!</p>
            <button className="contribute-button">
              <BookOpen size={16} />
              Submit a Tip
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TipsPage
