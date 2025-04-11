import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../css/display.css";
import SidebarR from "../../studentspage/studentSideBar";

const BioExamDisplay = () => {
    const [levels, setLevels] = useState({});
    const [unlockedLevels, setUnlockedLevels] = useState({ Biology: [1] });
    const [expandedLevel, setExpandedLevel] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const subject = new URLSearchParams(location.search).get("subject") || "Biology";

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

            let fetchedProgress = progressRes.data || {};
            if (!fetchedProgress[subject]) {
                fetchedProgress[subject] = [1];
            } else if (!fetchedProgress[subject].includes(1)) {
                fetchedProgress[subject].push(1);
                fetchedProgress[subject].sort((a, b) => a - b);
            }
            setUnlockedLevels(fetchedProgress);
        } catch (error) {
            console.error("Error fetching progress:", error);
            setError(error.response?.data?.message || "Failed to fetch progress");
            setUnlockedLevels({ [subject]: [1] });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userInfo = getUserInfo();
                if (!userInfo) {
                    throw new Error("User not authenticated");
                }

                const questionsRes = await axios.get(
                    `/api/v1/quiz?subject=${subject}&groupByLevel=true`,
                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                );

                if (!questionsRes.data.success || !questionsRes.data.data || Object.keys(questionsRes.data.data).length === 0) {
                    throw new Error("No questions found for this subject");
                }

                console.log("Fetched Levels:", questionsRes.data.data);
                setLevels(questionsRes.data.data);

                await fetchProgress(userInfo);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.response?.data?.message || error.message);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [subject, navigate]);

    const handleAnswerChange = (questionId, selectedOption) => {
        console.log(`Selected answer for question ${questionId}: ${selectedOption}`);
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

    const handleSubmit = async (level) => {
        setSubmitting(true);
        try {
            const userInfo = getUserInfo();
            if (!userInfo) {
                throw new Error("User not authenticated");
            }

            const questions = levels[`level${level}`];
            if (!questions || questions.length === 0) {
                throw new Error("No questions found for this level");
            }

            console.log("Answers:", answers);
            console.log("Questions:", questions);

            const score = questions.reduce((acc, q) => {
                if (!answers[q._id]) {
                    console.log(`No answer selected for question ${q._id}`);
                    return acc;
                }

                const studentAnswer = String(answers[q._id]).toUpperCase().trim();
                const correctAnswer = String(q.correctAnswer).toUpperCase().trim();
                console.log(`Comparing ${studentAnswer} === ${correctAnswer} for question ${q._id}`);
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

            await fetchProgress(userInfo);

            if (percentage >= 70 && level < 5) {
                const nextLevel = level + 1;
                if (unlockedLevels[subject].includes(nextLevel)) {
                    setMessage(`You scored ${percentage.toFixed(0)}%. Level ${nextLevel} is already unlocked.`);
                } else {
                    setMessage(`Congratulations! You scored ${percentage.toFixed(0)}% and unlocked Level ${nextLevel}!`);
                }
            } else {
                setMessage(`You scored ${score}/${questions.length} (${percentage.toFixed(0)}%). You need 70% to unlock the next level.`);
            }

            setAnswers({});
        } catch (error) {
            console.error("Error submitting quiz:", error);
            setError(error.response?.data?.message || "Failed to submit quiz");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading quiz...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <SidebarR />
            <div className="quiz-container">
                <div className="sticky-header">
                    <div className="quiz-title">{subject} Quiz</div>
                    {message && <div className="message">{message}</div>}
                    <div className="level-tabs">
                        {[1, 2, 3, 4, 5].map(level => {
                            const isUnlocked = unlockedLevels[subject]?.includes(level) || false;
                            return (
                                <div
                                    key={level}
                                    className={`level-tab-wrapper ${
                                        expandedLevel && !isUnlocked ? "blocked" : ""
                                    }`}
                                >
                                    <button
                                        onClick={() => handleLevelToggle(level)}
                                        disabled={!isUnlocked}
                                        className={`level-tab ${
                                            expandedLevel === level ? "active" : ""
                                        } ${isUnlocked ? "unlocked" : "locked"}`}
                                    >
                                        <span>Level {level}</span>
                                        <span className="lock-icon">
                                            {isUnlocked ? "🔑" : "🔒"}
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
                            </div>
                            <div className="questions-list">
                                {levels[`level${expandedLevel}`].map((question, index) => (
                                    <div key={`q-${question._id}`} className="question-card">
                                        <h3>Q{index + 1}: {question.question}</h3>
                                        <div className="options">
                                            {question.options.map((option, optIndex) => (
                                                <div key={`opt-${optIndex}`} className="option">
                                                    <input
                                                        type="radio"
                                                        id={`q-${question._id}-${optIndex}`}
                                                        name={`q-${question._id}`}
                                                        checked={answers[question._id] === String.fromCharCode(65 + optIndex)}
                                                        onChange={() => handleAnswerChange(question._id, String.fromCharCode(65 + optIndex))}
                                                    />
                                                    <label htmlFor={`q-${question._id}-${optIndex}`}>
                                                        {String.fromCharCode(65 + optIndex)}. {option}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BioExamDisplay;