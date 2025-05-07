"use client"

import { useState, useEffect, useRef } from "react"
import "../css/index.css"
import "../css/topPerformance.css"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [topPerformers, setTopPerformers] = useState(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [currentDisplay, setCurrentDisplay] = useState(null)
  const carouselRef = useRef(null)

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










  // Fetch top performers
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  // Filter subjects based on active category
  const filteredSubjects = subjectList.filter((subject) => {
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

  // Calculate max slides
  const maxSlides = Math.max(0, Math.ceil(filteredSubjects.length / 4) - 1)

  // Next slide handler
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < maxSlides ? prev + 1 : 0))
  }

  // Previous slide handler
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : maxSlides))
  }

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 7000)
    return () => clearInterval(interval)
  }, [currentSlide, filteredSubjects.length])


   const getMedalIcon = (rank) => {
    switch (rank) {
      case 1: return <i className="fas fa-medal" style={{ color: 'gold' }}></i>;
      case 2: return <i className="fas fa-medal" style={{ color: 'silver' }}></i>;
      case 3: return <i className="fas fa-medal" style={{ color: '#cd7f32' }}></i>;
      default: return null;
    }
  }

  return (
    <div className="app">
      
      <motion.div 
        className={`head ${isScrolled ? "scrolled" : ""}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>EthioAce</h1>
        <h2>National Exam Preparation platform</h2>
        <nav className="nav1">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Courses</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Exams</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Tips</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>About us</motion.button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="./login" className="login">
              Login
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/signup" className="signup">
              Signup
            </Link>
          </motion.div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="main-content1">
        {/* Hero Section */}
        <div className="hero-section">
          <motion.div 
            className="hero-content"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="hero-title">Unlock Your Academic Potential</h1>
            <p className="hero-subtitle">
              With EthioAce, every click takes you closer to success in your educational journey
            </p>
            <div className="hero-buttons">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="hero-btn primary-btn">
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="hero-btn secondary-btn">
                  Explore Courses
                </Link>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            className="hero-image"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <img src={subjects || "/placeholder.svg"} alt="Students learning" />
          </motion.div>
        </div>


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


        {/* Features Section */}
        <div className="features-section">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Why Choose EthioAce?
          </motion.h2>
          <div className="features-container">
            {features.map((feature, index) => (
              <motion.div 
                className="feature-card" 
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)" }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Courses Section */}
        <div className="featured-section">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Explore Our Subjects
          </motion.h2>


          {/* Carousel Container */}
          <div className="carousel-container">
            <motion.button 
              className="carousel-arrow carousel-prev" 
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={filteredSubjects.length <= 4}
            >
              <ChevronLeft size={24} />
            </motion.button>
            
            <div className="carousel-wrapper" ref={carouselRef}>
              <motion.div 
                className="carousel-track"
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {Array.from({ length: Math.ceil(filteredSubjects.length / 4) }).map((_, slideIndex) => (
                  <div className="carousel-slide" key={slideIndex}>
                    {filteredSubjects.slice(slideIndex * 4, slideIndex * 4 + 4).map((subject, index) => (
                      <motion.div 
                        className="card"
                        key={`${slideIndex}-${index}`}
                        whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="card-image">
                          <img src={subject.img || "/placeholder.svg"} alt={subject.name} />
                        </div>
                        <h3>{subject.name}</h3>
                        <div className="card-overlay"></div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
            
            <motion.button 
              className="carousel-arrow carousel-next" 
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={filteredSubjects.length <= 4}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
          
          {/* Carousel Indicators */}
          {filteredSubjects.length > 4 && (
            <div className="carousel-indicators">
              {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                <motion.button
                  key={index}
                  className={`carousel-indicator ${currentSlide === index ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  animate={currentSlide === index ? { scale: 1.2 } : { scale: 1 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <motion.div 
          className="cta-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="cta-content">
            <h2>Ready to Excel in Your Studies?</h2>
            <p>Join thousands of students who are achieving academic success with EthioAce</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup" className="cta-button">
                Sign Up Now
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <div className="testimonials-section">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Our Students Say
          </motion.h2>
          <div className="testimonials-container">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                index === activeTestimonial && (
                  <motion.div 
                    key={testimonial.id} 
                    className="testimonial-item"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="testimonial-avatar">
                      <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    </div>
                    <div className="testimonial-content">
                      <p className="testimonial-quote">"{testimonial.quote}"</p>
                      <h4 className="testimonial-name">{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`testimonial-dot ${activeTestimonial === index ? "active" : ""}`}
                  onClick={() => setActiveTestimonial(index)}
                  whileHover={{ scale: 1.2 }}
                  animate={activeTestimonial === index ? { scale: 1.2 } : { scale: 1 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="quick-links-section">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Quick Access
          </motion.h2>
          <div className="quick-links-container">
            {[
              { to: "/courses", icon: "fas fa-book", text: "Courses" },
              { to: "/quizzes", icon: "fas fa-question-circle", text: "Quizzes" },
              { to: "/tips", icon: "fas fa-lightbulb", text: "Tips & Guides" },
              { to: "/community", icon: "fas fa-users", text: "Community" }
            ].map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, backgroundColor: "var(--primary-light)", color: "white" }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={link.to} className="quick-link">
                  <i className={link.icon}></i>
                  <p>{link.text}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="about">
          <div className="about-container">
            <motion.div 
              className="about-image"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <img src={subjects || "/placeholder.svg"} alt="Learning illustration" />
            </motion.div>
            <motion.div 
              className="about-content"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2>What We Offer</h2>
              <p>
                Designed to empower students and educators, our platform brings you curated content to level up your
                learning.
              </p>
              <ul>
                {[
                  "High-quality References",
                  "Study Tips & Strategies",
                  "Practice Quizzes",
                  "Interactive Assignments",
                  "National exam questions"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <i className="fas fa-check-circle"></i> {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
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
