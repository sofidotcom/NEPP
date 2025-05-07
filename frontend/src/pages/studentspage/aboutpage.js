"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../css/about.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import teamImage from "../../images/team.jfif"
import missionImage from "../../images/mission.jfif"
import visionImage from "../../images/vision.jfif"

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "sefinew yeshaneh",
    role: "Founder",
    avatar: "",
  },
  {
    id: 2,
    name: "Elias derese",
    role: "Founder",
    avatar: "",
  },
  {
    id: 3,
    name: "Zelalem Temesgen",
    role: "Founder",
    avatar: "",
  },
  {
    id: 4,
    name: "Adissu yhun",
    role: "Founder",
    avatar: "",
  },
]

// Milestones data
const milestones = [
  {
    year: "2024 october",
    title: "Foundation",
    description: "EthioAce was founded with a mission to quality education and to ace the preparation for national exam .",
  },
  {
    year: "2025 february",
    title: "First Platform progress",
    description: "working on our first online platform with courses for science subjects.",
  },
  {
    year: "2025 april",
    title: "Expanded Curriculum",
    description: "Added comprehensive coverage for all national exam subjects.",
  },
  {
    year: "2025 april",
    title: "Mobile App",
    description: "working on our mobile application for learning on the go.",
  },
  {
    year: "2025 may",
    title: "launch",
    description: "deploy it in a webserver",
  },
]

const AboutPage = () => {
  const [isScrolled, setIsScrolled] = useState(false)

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

  return (
    <div className="app">
      {/* Header with conditional class for scroll effect */}
      <div className={`head ${isScrolled ? "scrolled" : ""}`}>
        <h1>EthioAce</h1>
        <nav className="nav1">
          <button>Courses</button>
          <button>Exams</button>
          <button>Tips</button>
          <button className="active">About us</button>
          <Link to="./login" className="login">
            Login
          </Link>
          <Link to="/signup" className="signup">
            Signup
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="about-main-content">
        {/* About Hero Section */}
        <div className="about-hero-section">
          <div className="about-hero-content">
            <h1>About EthioAce</h1>
            <p>
              We're on a mission to make quality education accessible to every Ethiopian student, regardless of their
              location or background.
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="about-section">
          <div className="about-container">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                EthioAce was founded in 2024 by a group of Bahirdar university students who recognized the challenges students
                face when preparing for national exams. We started with a simple goal: to create high-quality,
                accessible study materials that would help students succeed.
              </p>
              <p>
                What began as a small collection of study guides has grown into a comprehensive educational platform. Today, we offer resources for all major subjects, practice
                exams, interactive quizzes, and a supportive learning community.
              </p>
            </div>
            <div className="about-image">
              <img src={teamImage || "/placeholder.svg?height=400&width=600"} alt="EthioAce team" />
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="mission-vision-section">
          <div className="mission-container">
            <div className="mission-image">
              <img src={missionImage || "/placeholder.svg?height=300&width=400"} alt="Our mission" />
            </div>
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                To distribute quality education by providing accessible, affordable, and comprehensive learning
                resources that empower Ethiopian students to excel academically in preparation for their entrance exam and reach their full potential.
              </p>
              <ul className="mission-points">
                <li>
                  <i className="fas fa-check-circle"></i> Make quality education accessible to all
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Bridge educational gaps across regions
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Prepare students for academic success
                </li>
              </ul>
            </div>
          </div>

          <div className="vision-container">
            <div className="vision-content">
              <h2>Our Vision</h2>
              <p>
                To become the leading educational platform in Ethiopia, known for excellence in content, helpful in preparation for exams, and measurable impact on student outcomes.
              </p>
              <ul className="vision-points">
                <li>
                  <i className="fas fa-check-circle"></i> Create a generation of confident, knowledgeable learners
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Set new standards for educational resources
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Foster a nationwide culture of academic excellence
                </li>
              </ul>
            </div>
            <div className="vision-image">
              <img src={visionImage || "/placeholder.svg?height=300&width=400"} alt="Our vision" />
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-container">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Excellence</h3>
              <p>We strive for excellence in all our educational content and services.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Accessibility</h3>
              <p>We believe quality education should be accessible to every student.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Innovation</h3>
              <p>We continuously work hard to improve the learning experience.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community</h3>
              <p>We foster a supportive community of learners and educators.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            a team of four working cooperatively to a common goal of acing the educational status of the students
          </p>
          <div className="team-container">
            {teamMembers.map((member) => (
              <div className="team-card" key={member.id}>
                <div className="team-avatar">
                  <img src={member.avatar || "/placeholder.svg?height=150&width=150"} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Section */}
        <div className="milestones-section">
          <h2>Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>Have questions or want to learn more about EthioAce? We'd love to hear from you!</p>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>Bahirdar, Ethiopia</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <p>info@ethioace.edu.et</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <p>+251 911223344</p>
                </div>
              </div>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send Us a Message</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subject" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows={4} required></textarea>
                </div>
                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="about-cta-section">
          <div className="about-cta-content">
            <h2>Join the EthioAce Community</h2>
            <p>Start your journey to academic excellence today</p>
            <div className="about-cta-buttons">
              <Link to="/signup" className="cta-button primary">
                Sign Up Now
              </Link>
              <Link to="/login" className="cta-button secondary">
                Explore Courses
              </Link>
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

export default AboutPage;
