"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import "../../../css/entrance.css"
import "katex/dist/katex.min.css"
import { BlockMath } from "react-katex"

const BioEntranceDisplay = () => {
  const { subject, year } = useParams()
  const [allQuestions, setAllQuestions] = useState([])
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [gradeFilter, setGradeFilter] = useState("")
  const [feedback, setFeedback] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1800)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [imageError, setImageError] = useState({})
  // Enhanced state variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [flaggedQuestions, setFlaggedQuestions] = useState({})
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [flaggedCount, setFlaggedCount] = useState(0)
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [animation, setAnimation] = useState("")
  // Add a state to track if grade is locked
  const [isGradeLocked, setIsGradeLocked] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/v1/entrance/${subject}/${year}`)
        setAllQuestions(response.data)
        setFilteredQuestions(response.data)
      } catch (error) {
        console.error("Error fetching questions:", error.message)
      }
    }
    fetchQuestions()
  }, [subject, year])

  useEffect(() => {
    if (gradeFilter) {
      setFilteredQuestions(allQuestions.filter((q) => q.grade === gradeFilter))
      setCurrentQuestionIndex(0)
    } else {
      setFilteredQuestions(allQuestions)
    }
  }, [gradeFilter, allQuestions])

  useEffect(() => {
    if (!isTimerRunning || timeLeft === 0) return

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [isTimerRunning, timeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit()
    }
  }, [timeLeft])

  // Update counts when feedback or flagged questions change
  useEffect(() => {
    setAnsweredCount(Object.keys(feedback).length)
  }, [feedback])

  useEffect(() => {
    setFlaggedCount(Object.values(flaggedQuestions).filter(Boolean).length)
  }, [flaggedQuestions])

  const handleAnswerClick = (questionId, selectedOption, correctAnswer) => {
    const isCorrect = selectedOption === correctAnswer
    setFeedback((prev) => ({
      ...prev,
      [questionId]: { isCorrect, selectedOption },
    }))

    // Add animation effect when answering
    setAnimation("pulse")
    setTimeout(() => setAnimation(""), 500)
  }

  const handleSubmit = async () => {
    if (!showConfirmSubmit) {
      setShowConfirmSubmit(true)
      return
    }

    let totalScore = 0
    filteredQuestions.forEach((question) => {
      if (feedback[question._id] && feedback[question._id].isCorrect) {
        totalScore += 1
      }
    })

    setScore(totalScore)
    setSubmitted(true)
    setShowConfirmSubmit(false)

    const studentId = localStorage.getItem("userId")
    try {
      await axios.post("/api/v1/score", {
        student: studentId,
        year: year,
        score: totalScore,
        totalQuestions: filteredQuestions.length,
        subject: filteredQuestions[0]?.subject || "biology",
      })
    } catch (error) {
      console.error("Error submitting answers:", error.message)
    }
  }

  const cancelSubmit = () => {
    setShowConfirmSubmit(false)
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`
    }
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Update the timer button to add a pulsing effect when paused
  // Also lock the grade when starting the exam
  const handleStartPause = () => {
    // If we're starting the exam and grade isn't locked yet, lock it
    if (!isTimerRunning && !isGradeLocked) {
      setIsGradeLocked(true)
    }

    setIsTimerRunning((prev) => !prev)
  }

  const handleImageError = (id) => {
    setImageError((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  // Enhanced navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setAnimation("slide-left")
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setAnimation("")
      }, 300)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setAnimation("slide-right")
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
        setAnimation("")
      }, 300)
    }
  }

  const goToQuestion = (index) => {
    if (index >= 0 && index < filteredQuestions.length) {
      if (index > currentQuestionIndex) {
        setAnimation("slide-left")
      } else if (index < currentQuestionIndex) {
        setAnimation("slide-right")
      }

      setTimeout(() => {
        setCurrentQuestionIndex(index)
        setAnimation("")
      }, 300)
    }
  }

  const toggleFlagQuestion = (index) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const toggleShowFlaggedOnly = () => {
    setShowFlaggedOnly(!showFlaggedOnly)

    if (!showFlaggedOnly) {
      // Find the first flagged question
      const firstFlaggedIndex = Object.keys(flaggedQuestions).find((key) => flaggedQuestions[key] === true)

      if (firstFlaggedIndex) {
        goToQuestion(Number.parseInt(firstFlaggedIndex))
      }
    }
  }

  const renderContent = (content, id) => {
    if (!content) return null
    return (
      <div className="content-wrapper">
        {content.text && <p>{content.text}</p>}
        {content.latex && (
          <div className="latex-wrapper">
            <BlockMath math={content.latex} />
          </div>
        )}
        {content.image && !imageError[id] && (
          <div className="image-wrapper">
            <img
              src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/${content.image.replace(/^\//, "")}`}
              alt="Question or option"
              className="option-image"
              onError={() => handleImageError(id)}
            />
          </div>
        )}
      </div>
    )
  }

  // Enhanced question numbers rendering
  const renderQuestionNumbers = () => {
    return (
      <div className="question-numbers-container">
        <div className="back-to-home-container">
          <button 
            className="back-to-home-button"
            onClick={() => window.location.href = '/'}
          >
            <span className="back-icon">←</span> Back to Home
          </button>
        </div>
        <div className="question-numbers-header">
          <h4>Questions</h4>
          <div className="question-filters">
            <button
              className={`filter-btn ${showFlaggedOnly ? "active" : ""}`}
              onClick={toggleShowFlaggedOnly}
              disabled={flaggedCount === 0}
            >
              {showFlaggedOnly ? "Show All" : "Flagged Only"}
            </button>
          </div>
        </div>
        <div className="question-numbers">
          {filteredQuestions.map((question, index) => {
            // Skip non-flagged questions when showing flagged only
            if (showFlaggedOnly && !flaggedQuestions[index]) {
              return null
            }

            return (
              <button
                key={index}
                className={`question-number-btn ${index === currentQuestionIndex ? "active" : ""} 
                  ${flaggedQuestions[index] ? "flagged" : ""} 
                  ${feedback[question._id] ? "answered" : ""}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
        <div className="question-stats">
          <div className="stat-item">
            <span className="stat-label">Answered:</span>
            <span className="stat-value">
              {answeredCount}/{filteredQuestions.length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Flagged:</span>
            <span className="stat-value">{flaggedCount}</span>
          </div>
        </div>
      </div>
    )
  }

  // Function to reset the exam
  const resetExam = () => {
    setIsGradeLocked(false)
    setIsTimerRunning(false)
    setTimeLeft(1800)
    setFeedback({})
    setSubmitted(false)
    setScore(0)
    setCurrentQuestionIndex(0)
    setFlaggedQuestions({})
    setShowConfirmSubmit(false)
    setAnsweredCount(0)
    setFlaggedCount(0)
    setShowFlaggedOnly(false)
    setAnimation("")
  }

  // Modify the timer button rendering to add the pulsing class when not running
  return (
    <div className="exam-container">
      <div className="controls-container">
        <div className="exam-header">
          <h2>
            {subject
              ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} Entrance Exam (${year})`
              : "Entrance Exam"}
          </h2>
          <div className="timer-section" style={{ position: "relative", zIndex: 100 }}>
            <div className={`timer ${timeLeft < 300 ? "timer-warning" : ""}`}>
              <span className="timer-icon">⏱</span>
              <span className="timer-text">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleStartPause}
              className={`timer-button ${!isTimerRunning ? "start-pulse" : ""}`}
              style={{
                position: "relative",
                zIndex: 100,
                boxShadow: !isTimerRunning ? "0 0 15px 5px rgba(52, 152, 219, 0.7)" : "none",
                transform: !isTimerRunning ? "scale(1.1)" : "scale(1)",
              }}
            >
              {isTimerRunning ? "Pause" : "Start"}
            </button>
          </div>
        </div>

        <div className="grade-filter-container">
          <label htmlFor="gradeFilter">Filter by Grade:</label>
          <select
            id="gradeFilter"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            disabled={isGradeLocked}
            style={{
              opacity: isGradeLocked ? 0.7 : 1,
              cursor: isGradeLocked ? "not-allowed" : "pointer",
            }}
          >
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          {isGradeLocked && (
            <div
              className="grade-locked-message"
              style={{
                marginLeft: "10px",
                fontSize: "0.8rem",
                color: "#e74c3c",
                fontWeight: "bold",
              }}
            >
              Grade locked
            </div>
          )}
        </div>
      </div>

      {!isTimerRunning && <div className="blur-overlay" style={{ pointerEvents: "none" }}></div>}

      <div className={`exam-content ${!isTimerRunning ? "blur" : ""}`}>
        {submitted ? (
          <div className="score-container">
            <div className="score-card">
              <h2 className="score-title">Exam Completed!</h2>
              <div className="score-result">
                <div className="score-circle">
                  <span className="score-number">{score}</span>
                  <span className="score-total">/{filteredQuestions.length}</span>
                </div>
                <div className="score-percentage">{Math.round((score / filteredQuestions.length) * 100)}%</div>
              </div>
              <div className="score-message">
                {score === filteredQuestions.length
                  ? "Perfect score! Excellent work!"
                  : score >= filteredQuestions.length * 0.8
                    ? "Great job! You did very well."
                    : score >= filteredQuestions.length * 0.6
                      ? "Good effort! Keep studying to improve."
                      : "Keep practicing. You'll do better next time!"}
              </div>
              <button className="review-button" onClick={resetExam}>
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Question navigation numbers */}
            {renderQuestionNumbers()}

            {filteredQuestions.length === 0 ? (
              <div className="no-questions">
                <p>No questions available for the selected grade.</p>
                <p>Please select a different grade or check back later.</p>
              </div>
            ) : (
              // Show only the current question with animation
              <div className={`question-container ${animation}`}>
                {filteredQuestions[currentQuestionIndex] && (
                  <>
                    <div className="question-header">
                      <div className="question-header-left">
                        <h3 className="question-label">Question {currentQuestionIndex + 1}</h3>
                        <button
                          className={`flag-button ${flaggedQuestions[currentQuestionIndex] ? "flagged" : ""}`}
                          onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                          title={
                            flaggedQuestions[currentQuestionIndex]
                              ? "Unflag this question"
                              : "Flag this question for review"
                          }
                        >
                          {flaggedQuestions[currentQuestionIndex] ? "🚩" : "⚐"}
                        </button>
                      </div>
                      <div className="question-progress">
                        {currentQuestionIndex + 1} of {filteredQuestions.length}
                      </div>
                    </div>

                    <div className="question-content">
                      {renderContent(
                        filteredQuestions[currentQuestionIndex].question,
                        `q-${filteredQuestions[currentQuestionIndex]._id}`,
                      )}
                    </div>

                    <div className={`options-container ${animation === "pulse" ? "pulse" : ""}`}>
                      {filteredQuestions[currentQuestionIndex].options.map((option, optionIndex) => {
                        const isSelected =
                          feedback[filteredQuestions[currentQuestionIndex]._id]?.selectedOption ===
                          String.fromCharCode(65 + optionIndex)
                        const isCorrect = isSelected && feedback[filteredQuestions[currentQuestionIndex]._id]?.isCorrect
                        const isWrong = isSelected && !feedback[filteredQuestions[currentQuestionIndex]._id]?.isCorrect

                        return (
                          <div
                            className={`option-wrapper ${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                            key={optionIndex}
                          >
                            <button
                              className="option-button"
                              onClick={() =>
                                handleAnswerClick(
                                  filteredQuestions[currentQuestionIndex]._id,
                                  String.fromCharCode(65 + optionIndex),
                                  filteredQuestions[currentQuestionIndex].correctAnswer,
                                )
                              }
                              disabled={!!feedback[filteredQuestions[currentQuestionIndex]._id]}
                            >
                              {String.fromCharCode(65 + optionIndex)}
                            </button>
                            <div className="option-content">
                              {renderContent(
                                option,
                                `opt-${filteredQuestions[currentQuestionIndex]._id}-${optionIndex}`,
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {feedback[filteredQuestions[currentQuestionIndex]._id] && (
                      <div
                        className={`feedback-container ${feedback[filteredQuestions[currentQuestionIndex]._id].isCorrect ? "correct" : "wrong"}`}
                      >
                        <div className="feedback-icon">
                          {feedback[filteredQuestions[currentQuestionIndex]._id].isCorrect ? "✓" : "✗"}
                        </div>
                        <p className="feedback-text">
                          {feedback[filteredQuestions[currentQuestionIndex]._id].isCorrect
                            ? "Correct! Well done."
                            : `Incorrect. The correct answer is: ${filteredQuestions[currentQuestionIndex].correctAnswer}.`}
                        </p>
                      </div>
                    )}

                    <div className="navigation-buttons">
                      <button
                        onClick={goToPreviousQuestion}
                        className="nav-button prev-button"
                        disabled={currentQuestionIndex === 0}
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={goToNextQuestion}
                        className="nav-button next-button"
                        disabled={currentQuestionIndex === filteredQuestions.length - 1}
                      >
                        Next →
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="submit-section">
              <button onClick={handleSubmit} className="submit-button">
                {showConfirmSubmit ? "Confirm Submit" : "Submit Exam"}
              </button>

              {showConfirmSubmit && (
                <div className="confirm-submit">
                  <p>
                    You have answered {answeredCount} out of {filteredQuestions.length} questions.
                  </p>
                  <p>Are you sure you want to submit?</p>
                  <button onClick={cancelSubmit} className="cancel-button">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BioEntranceDisplay
