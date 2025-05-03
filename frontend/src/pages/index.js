"use client"

import { useState, useEffect } from "react"
import "../css/index.css"
import { Link } from "react-router-dom"
import biology from "../images/biology.jfif"
import aptitude from "../images/aptitude.jfif"
import chemistry from "../images/chemistry.png"
import mathsN from "../images/mathsN.png"
import mathsS from "../images/mathsS.jfif"
import physics from "../images/physics.jfif"
import english from "../images/english.jpg"
import economics from "../images/economics.jfif"
import civics from "../images/civics1.jpg"
import history from "../images/history1.jfif"
import geography from "../images/geography.jpg"
import questions from "../images/questions.avif"
import subjects from "../images/subjects.png"
import "@fortawesome/fontawesome-free/css/all.min.css"

// Sample testimonials
const testimonials = [
  {
    id: 1,
    name: "Abebe Kebede",
    quote: "EthioAce helped me ace my national exams with its amazing resources!",
    role: "Grade 12 Student",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Selam Tesfaye",
    quote: "The practice quizzes and tips were a game-changer for my studies.",
    role: "University Freshman",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Yonas Alem",
    quote: "I love the interactive assignments. Highly recommend joining!",
    role: "High School Teacher",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
  },
]

// Features list
const features = [
  {
    icon: "fas fa-book-open",
    title: "Comprehensive Study Materials",
    description: "Access detailed notes for all subjects",
  },
  { icon: "fas fa-tasks", title: "Practice Quizzes", description: "Test your knowledge with interactive quizzes" },
  {
    icon: "fas fa-graduation-cap",
    title: "Exam Preparation",
    description: "Get ready for national exams with our guides",
  },
  { icon: "fas fa-users", title: "Study Community", description: "Connect with other students and teachers" },
]

const Index = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSubject, setActiveSubject] = useState(null)

  // List of subjects
  const subjectList = [
    { name: "Biology", img: biology, route: "/subjects/biology" },
    { name: "Chemistry", img: chemistry, route: "/subjects/chemistry" },
    { name: "Physics", img: physics, route: "/subjects/physics" },
    { name: "Mathematics for Natural Science", img: mathsN, route: "/subjects/maths-natural" },
    { name: "Mathematics for Social Science", img: mathsS, route: "/subjects/maths-social" },
    { name: "Economics", img: economics, route: "/subjects/economics" },
    { name: "English", img: english, route: "/subjects/english" },
    { name: "Aptitude", img: aptitude, route: "/subjects/aptitude" },
    { name: "Civics and Ethics", img: civics, route: "/subjects/civics" },
    { name: "History", img: history, route: "/subjects/history" },
    { name: "Geography", img: geography, route: "/subjects/geography" },
    { name: "Miscellaneous Questions", img: questions, route: "/subjects/misc" },
  ]

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

  return (
    <div className="app">
      {/* Header with conditional class for scroll effect */}
      <div className={`head ${isScrolled ? "scrolled" : ""}`}>
        <h1>EthioAce</h1>
        <nav className="nav1">
          <button>Courses</button>
          <button>Exams</button>
          <button>Tips</button>
          <button>About us</button>
          <Link to="./login" className="login">
            Login
          </Link>
          <Link to="/signup" className="signup">
            Signup
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content1">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Unlock Your Academic Potential</h1>
            <p className="hero-subtitle">
              With EthioAce, every click takes you closer to success in your educational journey
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="hero-btn primary-btn">
                Get Started Free
              </Link>
              <Link to="/login" className="hero-btn secondary-btn">
                Explore Courses
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={subjects || "/placeholder.svg"} alt="Students learning" />
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Why Choose EthioAce?</h2>
          <div className="features-container">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Courses Section */}
        <div className="featured-section">
          <h2>Explore Our Subjects</h2>
          <div className="subject-categories">
            <button className={activeSubject === null ? "active" : ""} onClick={() => setActiveSubject(null)}>
              All Subjects
            </button>
            <button className={activeSubject === "science" ? "active" : ""} onClick={() => setActiveSubject("science")}>
              Science
            </button>
            <button className={activeSubject === "social" ? "active" : ""} onClick={() => setActiveSubject("social")}>
              Social Studies
            </button>
            <button
              className={activeSubject === "language" ? "active" : ""}
              onClick={() => setActiveSubject("language")}
            >
              Languages
            </button>
          </div>

          <div className="card-container">
            {subjectList
              .filter((subject) => {
                if (!activeSubject) return true
                if (activeSubject === "science") {
                  return ["Biology", "Chemistry", "Physics", "Mathematics for Natural Science"].includes(subject.name)
                }
                if (activeSubject === "social") {
                  return ["Economics", "Civics and Ethics", "History", "Geography"].includes(subject.name)
                }
                if (activeSubject === "language") {
                  return ["English"].includes(subject.name)
                }
                return true
              })
              .map((subject, index) => (
                <span className="card">
                  <div className="card-image">
                    <img src={subject.img || "/placeholder.svg"} alt={subject.name} />
                  </div>
                  <h3>{subject.name}</h3>
                  <div className="card-overlay"></div>
                </span>
              ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Excel in Your Studies?</h2>
            <p>Join thousands of students who are achieving academic success with EthioAce</p>
            <Link to="/signup" className="cta-button">
              Sign Up Now
            </Link>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-section">
          <h2>What Our Students Say</h2>
          <div className="testimonials-container">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-item">
                <div className="testimonial-avatar">
                  <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                </div>
                <div className="testimonial-content">
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="quick-links-section">
          <h2>Quick Access</h2>
          <div className="quick-links-container">
            <Link to="/courses" className="quick-link">
              <i className="fas fa-book"></i>
              <p>Courses</p>
            </Link>
            <Link to="/quizzes" className="quick-link">
              <i className="fas fa-question-circle"></i>
              <p>Quizzes</p>
            </Link>
            <Link to="/tips" className="quick-link">
              <i className="fas fa-lightbulb"></i>
              <p>Tips & Guides</p>
            </Link>
            <Link to="/community" className="quick-link">
              <i className="fas fa-users"></i>
              <p>Community</p>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="about">
          <div className="about-container">
            <div className="about-image">
              <img src={subjects || "/placeholder.svg"} alt="Learning illustration" />
            </div>
            <div className="about-content">
              <h2>What We Offer</h2>
              <p>
                Designed to empower students and educators, our platform brings you curated content to level up your
                learning.
              </p>
              <ul>
                <li>
                  <i className="fas fa-check-circle"></i> High-quality References
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Study Tips & Strategies
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Practice Quizzes
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Interactive Assignments
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> National exam questions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-top">
            <div className="footer-column">
              <h4>About</h4>
              <ul>
                <li>
                  <a href="#">Who We Are</a>
                </li>
                <li>
                  <a href="#">Our Mission</a>
                </li>
                <li>
                  <a href="#">What You Get Here</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Explore</h4>
              <ul>
                <li>
                  <a href="#">Subjects</a>
                </li>
                <li>
                  <a href="#">Tips & Guides</a>
                </li>
                <li>
                  <a href="#">Certifications</a>
                </li>
                <li>
                  <a href="#">Learning Paths</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Help</h4>
              <ul>
                <li>
                  <a href="#">Support Center</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">Terms & Policies</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Connect</h4>
              <div className="social-icons">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <div className="newsletter">
                <h5>Subscribe to our newsletter</h5>
                <div className="newsletter-form">
                  <input type="email" placeholder="Your email" />
                  <button>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
              <div className="language-select">
                🌐{" "}
                <select>
                  <option>English</option>
                  <option>አማርኛ</option>
                </select>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 EthioAce. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
