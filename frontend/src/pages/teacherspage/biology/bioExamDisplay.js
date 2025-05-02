import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../css/display.css";
import SidebarR from "../../studentspage/studentSideBar";

const BioExamDisplay = () => {
    const [levels, setLevels] = useState({});
    const [unlockedLevels, setUnlockedLevels] = useState({});
    const [expandedLevel, setExpandedLevel] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [completedLevels, setCompletedLevels] = useState({});
    const [showResults, setShowResults] = useState({}); // Now { [subject]: { [level]: boolean } }
    const [newlyUnlocked, setNewlyUnlocked] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const subject = (new URLSearchParams(location.search).get("subject") || "Biology").toLowerCase();

    const getUserInfo = () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        return userId && token ? { userId, token } : null;
    };

    const fetchProgress = async (userInfo) => {
        try {
            const progressRes = await axios.get(
                `/api/v1/progress/${userInfo.userId}`,
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );

            let fetchedProgress = progressRes.data.data?.subjectProgress || {};
            const normalizedProgress = {};
            Object.keys(fetchedProgress).forEach(key => {
                normalizedProgress[key.toLowerCase()] = fetchedProgress[key];
            });

            if (!normalizedProgress[subject]) {
                normalizedProgress[subject] = [1];
            } else if (!normalizedProgress[subject].includes(1)) {
                normalizedProgress[subject] = [1, ...normalizedProgress[subject]].sort((a, b) => a - b);
            }

            setUnlockedLevels(normalizedProgress);
            return normalizedProgress;
        } catch (error) {
            console.error("Error fetching progress:", error);
            const defaultProgress = { [subject]: [1] };
            setUnlockedLevels(defaultProgress);
            return defaultProgress;
        }
    };

    const fetchCompletedLevels = async (userInfo) => {
        try {
            const scoresRes = await axios.get(
                `/api/v1/quizscore?studentId=${userInfo.userId}&subject=${subject}`,
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );

            const completed = {};
            const results = {};
            scoresRes.data.data.forEach(score => {
                if (score.percentage >= 70) {
                    completed[score.level] = true;
                    results[score.level] = true;
                }
            });
            setCompletedLevels(completed);
            setShowResults(prev => ({
                ...prev,
                [subject]: { ...prev[subject], ...results }
            }));
            console.log("Fetched completed levels and results for", subject, ":", { completed, results });
        } catch (error) {
            console.error("Error fetching completed levels:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userInfo = getUserInfo();
                if (!userInfo) {
                    throw new Error("Please log in to access the quiz");
                }

                const [questionsRes] = await Promise.all([
                    axios.get(
                        `/api/v1/quiz?subject=${subject}&groupByLevel=true`,
                        { headers: { Authorization: `Bearer ${userInfo.token}` } }
                    ),
                    fetchProgress(userInfo),
                    fetchCompletedLevels(userInfo)
                ]);

                if (!questionsRes.data.success || !questionsRes.data.data || Object.keys(questionsRes.data.data).length === 0) {
                    throw new Error("No questions found for this subject");
                }

                setLevels(questionsRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.response?.data?.message || "Failed to load quiz. Please try again.");
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [subject, navigate]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleLevelToggle = (level) => {
        if (unlockedLevels[subject]?.includes(level)) {
            setExpandedLevel(expandedLevel === level ? null : level);
            setAnswers({});
        }
    };

    const handleBack = () => {
        setExpandedLevel(null);
        setAnswers({});
    };

    const handleRetake = async (level) => {
        try {
            const userInfo = getUserInfo();
            if (!userInfo) {
                throw new Error("Please log in to reset the level");
            }

            await axios.post(
                '/api/v1/quizscore/reset',
                { studentId: userInfo.userId, subject, level },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );

            setCompletedLevels(prev => ({ ...prev, [level]: false }));
            setShowResults(prev => ({
                ...prev,
                [subject]: { ...prev[subject], [level]: false }
            }));
            setAnswers({});

            setUnlockedLevels(prev => {
                const updated = { ...prev };
                updated[subject] = updated[subject].filter(lvl => lvl <= level).sort((a, b) => a - b);
                return updated;
            });

            setMessage("Level reset! You can now retake the quiz.");
        } catch (error) {
            console.error("Error resetting level:", error);
            setError(error.response?.data?.message || "Failed to reset level. Please try again.");
        }
    };

    const handleSubmit = async (level) => {
        setSubmitting(true);
        try {
            const userInfo = getUserInfo();
            if (!userInfo) {
                throw new Error("Please log in to submit the quiz");
            }

            const questions = levels[`level${level}`];
            if (!questions || questions.length === 0) {
                throw new Error("No questions available for this level");
            }

            const score = questions.reduce((acc, q) => {
                if (!answers[q._id]) return acc;
                const studentAnswer = String(answers[q._id]).toUpperCase().trim();
                const correctAnswer = String(q.correctAnswer).toUpperCase().trim();
                return studentAnswer === correctAnswer ? acc + 1 : acc;
            }, 0);

            const percentage = (score / questions.length) * 100;

            await axios.post(
                '/api/v1/quizscore',
                {
                    studentId: userInfo.userId,
                    subject,
                    level,
                    score,
                    totalQuestions: questions.length,
                    percentage,
                    answers
                },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );

            // Show results if score is >= 70%
            if (percentage >= 70) {
                setShowResults(prev => {
                    const updated = {
                        ...prev,
                        [subject]: { ...prev[subject], [level]: true }
                    };
                    console.log("Updated showResults after submission for", subject, ":", updated);
                    return updated;
                });
                setCompletedLevels(prev => ({ ...prev, [level]: true }));
                if (level < 5) {
                    setUnlockedLevels(prev => {
                        const updated = { ...prev };
                        if (!updated[subject]) updated[subject] = [1];
                        if (!updated[subject].includes(level + 1)) {
                            updated[subject] = [...updated[subject], level + 1].sort((a, b) => a - b);
                            setNewlyUnlocked(level + 1);
                            setTimeout(() => setNewlyUnlocked(null), 3000);
                        }
                        return updated;
                    });
                }
            }

            if (percentage >= 70) {
                if (level < 5) {
                    setMessage(`Congratulations! You scored ${percentage.toFixed(0)}% and unlocked Level ${level + 1}!`);
                } else {
                    setMessage(`Amazing! You scored ${percentage.toFixed(0)}% and completed all levels!`);
                }
            } else {
                setMessage(`You scored ${percentage.toFixed(0)}%. Score 70% or higher to unlock the next level.`);
            }

            await Promise.all([fetchProgress(userInfo), fetchCompletedLevels(userInfo)]);

        } catch (error) {
            console.error("Error submitting quiz:", error);
            setError(error.response?.data?.message || "Failed to submit quiz. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading quiz...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            {/* <SidebarR /> */}
            <div className="quiz-container">
                <div className="sticky-header">
                    <div className="quiz-title">{subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz</div>
                    {message && <div className="message">{message}</div>}
                    <div className="level-tabs">
                        {[1, 2, 3, 4, 5].map(level => {
                            const isUnlocked = unlockedLevels[subject]?.includes(level) || false;
                            const isCompleted = completedLevels[level] || false;
                            return (
                                <div
                                    key={level}
                                    className={`level-tab-wrapper ${expandedLevel && !isUnlocked ? "blocked" : ""} ${newlyUnlocked === level ? "newly-unlocked" : ""}`}
                                >
                                    <button
                                        onClick={() => handleLevelToggle(level)}
                                        disabled={!isUnlocked}
                                        className={`level-tab ${expandedLevel === level ? "active" : ""} ${isUnlocked ? "unlocked" : "locked"} ${isCompleted ? "completed" : ""}`}
                                        title={isUnlocked ? (isCompleted ? "Level completed" : "Click to attempt") : "Complete previous level to unlock"}
                                    >
                                        <span>Level {level}</span>
                                        <span className="lock-icon">
                                            {isUnlocked ? (isCompleted ? "✅" : "🔑") : "🔒"}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="scrollable-content">
                    {expandedLevel && levels[`level${expandedLevel}`]?.length > 0 && (
                        <div className="questions-section">
                            <div className="sticky-back-btn">
                                <button className="back-btn" onClick={handleBack}>
                                    ← Back to Levels
                                </button>
                                {completedLevels[expandedLevel] && (
                                    <button className="retake-btn" onClick={() => handleRetake(expandedLevel)}>
                                        Retake Level
                                    </button>
                                )}
                            </div>
                            <div className="questions-list">
                                {levels[`level${expandedLevel}`].map((question, index) => {
                                    const correctAnswer = question.correctAnswer.toUpperCase().trim();
                                    const shouldShowResults = showResults[subject]?.[expandedLevel] || false;

                                    return (
                                        <div
                                            key={`q-${question._id}`}
                                            className={`question-card ${shouldShowResults ? "completed-level" : ""}`}
                                        >
                                            <h3>Q{index + 1}: {question.question}</h3>
                                            <div className="options">
                                                {question.options.map((option, optIndex) => {
                                                    const optionLetter = String.fromCharCode(65 + optIndex);
                                                    const isCorrect = optionLetter === correctAnswer;
                                                    const isSelected = answers[question._id] === optionLetter;

                                                    return (
                                                        <div
                                                            key={`opt-${optIndex}`}
                                                            className={`option ${shouldShowResults ? (isCorrect ? "correct-answer" : isSelected && !isCorrect ? "incorrect-answer" : "") : ""}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                id={`q-${question._id}-${optIndex}`}
                                                                name={`q-${question._id}`}
                                                                checked={isSelected}
                                                                onChange={() => handleAnswerChange(question._id, optionLetter)}
                                                                disabled={shouldShowResults}
                                                            />
                                                            <label htmlFor={`q-${question._id}-${optIndex}`}>
                                                                {optionLetter}. {option}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {shouldShowResults && (
                                                <div className="answer-explanation">
                                                    <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                                                    {question.explanation && (
                                                        <p><strong>Explanation:</strong> {question.explanation}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {!showResults[subject]?.[expandedLevel] && (
                                    <button
                                        className="submit-btn"
                                        onClick={() => handleSubmit(expandedLevel)}
                                        disabled={
                                            submitting ||
                                            Object.keys(answers).length < levels[`level${expandedLevel}`].length
                                        }
                                    >
                                        {submitting ? "Submitting..." : "Submit Answers"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BioExamDisplay;