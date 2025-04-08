"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import "../../../css/entrance.css"
import "katex/dist/katex.min.css"
import { BlockMath } from "react-katex"

const BioEntranceDisplay = () => {
  const { year } = useParams()
  const [questions, setQuestions] = useState([])
  const [feedback, setFeedback] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 min
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [imageError, setImageError] = useState({})

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/v1/bioEntrance/${year}`)
        setQuestions(response.data)
      } catch (error) {
        console.error("Error fetching questions:", error.message)
      }
    }
    fetchQuestions()
  }, [year])

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

  const handleAnswerClick = (questionId, selectedOption, correctAnswer) => {
    const isCorrect = selectedOption === correctAnswer
    setFeedback((prev) => ({
      ...prev,
      [questionId]: { isCorrect, selectedOption },
    }))
  }

  const handleSubmit = async () => {
    let totalScore = 0
    questions.forEach((question) => {
      if (feedback[question._id] && feedback[question._id].isCorrect) {
        totalScore += 1
      }
    })

    setScore(totalScore)
    setSubmitted(true)

    const studentId = localStorage.getItem("userId")
    try {
      await axios.post("/api/v1/score", {
        student: studentId,
        year: year,
        score: totalScore,
        totalQuestions: questions.length,
      })
    } catch (error) {
      console.error("Error submitting answers:", error.message)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleStartPause = () => {
    setIsTimerRunning((prev) => !prev)
  }

  const handleImageError = (id) => {
    setImageError((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const renderContent = (content, id) => {
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

  return (
    <div className="exam-container">
      <div className="timer-controls">
        <h3>Time Left: {formatTime(timeLeft)}</h3>
        <button onClick={handleStartPause} className="timer-button">
          {isTimerRunning ? "Pause" : "Start"}
        </button>
      </div>

      {!isTimerRunning && <div className="blur-overlay"></div>}

      <div className={`exam-content ${!isTimerRunning ? "blur" : ""}`}>
        {submitted ? (
          <div className="score-container">
            <h2>
              Your Score: {score} out of {questions.length}
            </h2>
          </div>
        ) : (
          <>
            {questions.map((question, index) => (
              <div className="question-container" key={question._id}>
                <div className="question-header">
                  <h3 className="question-label">Question {index + 1}:</h3>
                  {/* Render Question Content inline with the label */}
                  {renderContent(question.question, `q-${question._id}`)}
                  
                </div>

                <div className="options-container">
                  {question.options.map((option, optionIndex) => (
                    <div className="option-wrapper" key={optionIndex}>
                      <button
                        className={`option-button ${
                          feedback[question._id]?.selectedOption === String.fromCharCode(65 + optionIndex)
                            ? feedback[question._id].isCorrect
                              ? "correct"
                              : "wrong"
                            : ""
                        }`}
                        onClick={() =>
                          handleAnswerClick(question._id, String.fromCharCode(65 + optionIndex), question.correctAnswer)
                        }
                        disabled={!!feedback[question._id]}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </button>

                      {/* Render Option Content */}
                      {renderContent(option, `opt-${question._id}-${optionIndex}`)}
                    </div>
                  ))}
                </div>

                {feedback[question._id] && (
                  <p className="feedback-text">
                    {feedback[question._id].isCorrect
                      ? "Correct!"
                      : `Wrong! The correct answer is: ${question.correctAnswer}.`}
                  </p>
                )}
              </div>
            ))}

            <button onClick={handleSubmit} className="submit-button">
              Submit Exam
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default BioEntranceDisplay



