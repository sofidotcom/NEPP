"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import '../../css/leaderboard/quizleader.css' // Reuse quizleader.css for consistent styling

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: ""
  })
  const [quizData, setQuizData] = useState([])
  const [entranceData, setEntranceData] = useState([])
  const [progressData, setProgressData] = useState(null)
  const [leaderboardData, setLeaderboardData] = useState(null)
  const [loading, setLoading] = useState({
    profile: true,
    quiz: true,
    entrance: true,
    progress: true,
    leaderboard: true
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (!token || !userId) {
      navigate("/login")
      return
    }

    // Fetch profile data
    axios.get(`/api/v1/profile/${id || userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUserData(response.data)
      setLoading(prev => ({...prev, profile: false}))
    })
    .catch(err => {
      console.error("Profile fetch error:", err)
      if (err.response?.status === 401) {
        navigate("/login")
      } else {
        setError("Failed to load profile data")
      }
      setLoading(prev => ({...prev, profile: false}))
    })

    // Fetch quiz scores
    axios.get(`/api/v1/quizscore`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { studentId: userId }
    })
    .then(response => {
      const data = Array.isArray(response.data.data) ? response.data.data : 
                  response.data.data ? [response.data.data] : []
      setQuizData(data)
      setLoading(prev => ({...prev, quiz: false}))
    })
    .catch(err => {
      console.error("Quiz data fetch error:", err)
      setQuizData([])
      setLoading(prev => ({...prev, quiz: false}))
    })

    // Fetch entrance exam data for the logged-in student
    axios.get(`/api/v1/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { studentId: userId }
    })
    .then(response => {
      const data = Array.isArray(response.data) ? response.data : 
                  response.data ? [response.data] : []
      setEntranceData(data)
      setLoading(prev => ({...prev, entrance: false}))
    })
    .catch(err => {
      console.error("Entrance data fetch error:", err)
      setEntranceData([])
      setLoading(prev => ({...prev, entrance: false}))
    })

    // Fetch progress data
    axios.get(`/api/v1/progress/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setProgressData(response.data.data)
      setLoading(prev => ({...prev, progress: false}))
    })
    .catch(err => {
      console.error("Progress data fetch error:", err)
      setProgressData(null)
      setLoading(prev => ({...prev, progress: false}))
    })

    // Fetch quiz leaderboard data for ranking
    axios.get(`/api/v1/quizleader`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { studentId: userId }
    })
    .then(response => {
      setLeaderboardData(response.data.data)
      setLoading(prev => ({...prev, leaderboard: false}))
    })
    .catch(err => {
      console.error("Leaderboard data fetch error:", err)
      setLeaderboardData(null)
      setLoading(prev => ({...prev, leaderboard: false}))
    })
  }, [id, navigate])

  const calculateQuizPerformance = (quizData, progressData) => {
    if (!Array.isArray(quizData) || quizData.length === 0) return null

    const subjectStats = {}
    let totalQuizzes = 0
    let totalScore = 0

    quizData.forEach(quiz => {
      const subject = quiz.subject.toLowerCase()
      if (!subjectStats[subject]) {
        subjectStats[subject] = {
          quizzesTaken: 0,
          totalScore: 0,
          highestScore: 0,
          levelsAttempted: new Set(),
          scores: []
        }
      }
      subjectStats[subject].quizzesTaken += 1
      subjectStats[subject].totalScore += quiz.percentage
      subjectStats[subject].highestScore = Math.max(subjectStats[subject].highestScore, quiz.percentage)
      subjectStats[subject].levelsAttempted.add(quiz.level)
      subjectStats[subject].scores.push({ percentage: quiz.percentage, date: quiz.createdAt })
      totalQuizzes += 1
      totalScore += quiz.percentage
    })

    if (progressData?.subjectProgress) {
      Object.entries(progressData.subjectProgress).forEach(([subject, levels]) => {
        subject = subject.toLowerCase()
        if (!subjectStats[subject]) {
          subjectStats[subject] = {
            quizzesTaken: 0,
            totalScore: 0,
            highestScore: 0,
            levelsAttempted: new Set(),
            scores: []
          }
        }
        subjectStats[subject].levelsPassed = levels.length
        subjectStats[subject].highestLevelPassed = Math.max(...levels)
      })
    }

    Object.keys(subjectStats).forEach(subject => {
      const stats = subjectStats[subject]
      stats.averageScore = stats.quizzesTaken > 0 ? (stats.totalScore / stats.quizzesTaken).toFixed(1) : 0
      stats.levelsAttempted = stats.levelsAttempted.size
      if (stats.scores.length >= 2) {
        const sortedScores = stats.scores.sort((a, b) => new Date(b.date) - new Date(a.date))
        stats.improvement = (sortedScores[0].percentage - sortedScores[1].percentage).toFixed(1)
      } else {
        stats.improvement = 0
      }
    })

    return {
      totalQuizzes,
      overallAverageScore: totalQuizzes > 0 ? (totalScore / totalQuizzes).toFixed(1) : 0,
      subjectStats,
      recentQuizzes: quizData.slice(0, 3).map(quiz => ({
        subject: quiz.subject,
        percentage: Math.round(quiz.percentage),
        level: quiz.level,
        date: quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "N/A"
      }))
    }
  }

  const calculateEntrancePerformance = (entranceData, userId) => {
    if (!Array.isArray(entranceData) || entranceData.length === 0) return null

    // Filter exams for the logged-in student only
    const studentExams = entranceData.filter(exam => exam.student?.toString() === userId)
    if (studentExams.length === 0) return null

    const subjectStats = {}
    let totalExams = 0
    let totalScore = 0

    studentExams.forEach(exam => {
      const subject = exam.subject.toLowerCase()
      const percentage = exam.percentage || (exam.score / exam.totalQuestions) * 100
      if (!subjectStats[subject]) {
        subjectStats[subject] = {
          examsTaken: 0,
          totalScore: 0,
          highestScore: 0
        }
      }
      subjectStats[subject].examsTaken += 1
      subjectStats[subject].totalScore += percentage
      subjectStats[subject].highestScore = Math.max(subjectStats[subject].highestScore, percentage)
      totalExams += 1
      totalScore += percentage
    })

    Object.keys(subjectStats).forEach(subject => {
      const stats = subjectStats[subject]
      stats.averageScore = stats.examsTaken > 0 ? (stats.totalScore / stats.examsTaken).toFixed(1) : 0
    })

    return {
      totalExams,
      overallAverageScore: totalExams > 0 ? (totalScore / totalExams).toFixed(1) : 0,
      subjectStats,
      recentExams: studentExams
        .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0))
        .slice(0, 3)
        .map(exam => ({
          subject: exam.subject,
          percentage: Math.round(exam.percentage || (exam.score / exam.totalQuestions) * 100),
          year: exam.year || "N/A",
          date: exam.submittedAt ? new Date(exam.submittedAt).toLocaleDateString() : "N/A"
        }))
    }
  }

  const calculateLeaderboardRank = (leaderboardData, userId) => {
    if (!leaderboardData?.overall) return null

    const overallRank = leaderboardData.overall.findIndex(student => student.id.toString() === userId) + 1
    const subjectRanks = {}
    
    if (leaderboardData.bySubject) {
      Object.entries(leaderboardData.bySubject).forEach(([subject, students]) => {
        const rank = students.findIndex(student => student.studentId.toString() === userId) + 1
        if (rank > 0) subjectRanks[subject] = rank
      })
    }

    return {
      overallRank: overallRank > 0 ? overallRank : "N/A",
      subjectRanks
    }
  }

  const calculateStreaks = (progressData) => {
    if (!progressData?.subjectProgress) return []

    const streaks = []
    Object.entries(progressData.subjectProgress).forEach(([subject, levels]) => {
      if (!Array.isArray(levels) || levels.length < 2) return

      const sortedLevels = [...new Set(levels)].sort((a, b) => a - b)
      let currentStreak = 1
      let maxStreak = 1

      for (let i = 1; i < sortedLevels.length; i++) {
        if (sortedLevels[i] === sortedLevels[i-1] + 1) {
          currentStreak++
          maxStreak = Math.max(maxStreak, currentStreak)
        } else {
          currentStreak = 1
        }
      }

      if (maxStreak > 1) {
        streaks.push({
          subject,
          streak: maxStreak,
          levels: sortedLevels.slice(0, maxStreak)
        })
      }
    })

    return streaks.sort((a, b) => b.streak - a.streak).slice(0, 3)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    navigate("/login")
  }

  if (loading.profile) return <div className="ql-loading-container"><div className="ql-spinner"></div></div>
  if (error) return <div className="ql-error-container">{error}<button onClick={() => window.location.reload()} className="ql-retry-btn">Retry</button></div>

  const userId = localStorage.getItem("userId")
  const quizPerformance = calculateQuizPerformance(quizData, progressData)
  const entrancePerformance = calculateEntrancePerformance(entranceData, userId)
  const leaderboardRank = calculateLeaderboardRank(leaderboardData, userId)
  const streaks = calculateStreaks(progressData)

  return (
    <div className="ql-leaderboard-page">
      <div className="ql-leaderboard-container">
        {/* Profile Section */}
        <div className="ql-subject-board">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-semibold">Name:</label>
              <div className="mt-1">{userData.name}</div>
            </div>
            <div>
              <label className="font-semibold">Email:</label>
              <div className="mt-1">{userData.email}</div>
            </div>
            <div>
              <label className="font-semibold">Phone Number:</label>
              <div className="mt-1">{userData.phoneNumber || 'Not provided'}</div>
            </div>
          </div>
          <button 
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Performance Summary */}
        <div className="ql-subject-board">
          <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border p-3 rounded">
              <h3 className="font-semibold">Total Quizzes</h3>
              <p className="text-xl">{quizPerformance?.totalQuizzes || 0}</p>
            </div>
            <div className="border p-3 rounded">
              <h3 className="font-semibold">Quiz Avg Score</h3>
              <p className="text-xl">{quizPerformance?.overallAverageScore || 0}%</p>
            </div>
            <div className="border p-3 rounded">
              <h3 className="font-semibold">Total Exams</h3>
              <p className="text-xl">{entrancePerformance?.totalExams || 0}</p>
            </div>
            <div className="border p-3 rounded">
              <h3 className="font-semibold">Exam Avg Score</h3>
              <p className="text-xl">{entrancePerformance?.overallAverageScore || 0}%</p>
            </div>
          </div>
          {leaderboardRank && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Leaderboard Rankings</h3>
              <div className="border p-3 rounded">
                <p>Overall Quiz Rank: {leaderboardRank.overallRank}</p>
                {Object.entries(leaderboardRank.subjectRanks).map(([subject, rank]) => (
                  <p key={subject} className="capitalize">{subject} Rank: {rank}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quiz Performance */}
        <div className="ql-subject-board">
          <h2 className="text-xl font-bold mb-4">Quiz Performance</h2>
          {loading.quiz ? (
            <p>Loading quiz data...</p>
          ) : quizPerformance ? (
            <div className="space-y-4">
              <div className="ql-leaderboard-table">
                <div className="ql-table-header">
                  <span>Subject</span>
                  <span>Quizzes Taken</span>
                  <span>Avg Score</span>
                  <span>Highest Score</span>
                  <span>Levels Passed</span>
                  <span>Improvement</span>
                </div>
                {Object.entries(quizPerformance.subjectStats).map(([subject, stats]) => (
                  <div key={subject} className="ql-table-row">
                    <span className="capitalize">{subject}</span>
                    <span>{stats.quizzesTaken}</span>
                    <span>{stats.averageScore}%</span>
                    <span>{stats.highestScore}%</span>
                    <span>{stats.levelsPassed || 0}</span>
                    <span className={stats.improvement > 0 ? "ql-highlight" : ""}>
                      {stats.improvement > 0 ? `+${stats.improvement}%` : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
              {quizPerformance.recentQuizzes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Recent Quizzes</h3>
                  <div className="space-y-2">
                    {quizPerformance.recentQuizzes.map((quiz, index) => (
                      <div key={index} className="border p-3 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">{quiz.subject}</span>
                          <span className="font-bold">{quiz.percentage}%</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Level {quiz.level} • {quiz.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {streaks.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Level Streaks</h3>
                  <div className="space-y-2">
                    {streaks.map((streak, index) => (
                      <div key={index} className="border p-3 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">{streak.subject}</span>
                          <span className="font-bold">{streak.streak} Levels</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Levels: {streak.levels.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>No quiz data available</p>
          )}
        </div>

        {/* Entrance Exam Performance */}
        <div className="ql-subject-board">
          <h2 className="text-xl font-bold mb-4">Entrance Exam Performance</h2>
          {loading.entrance ? (
            <p>Loading entrance exam data...</p>
          ) : entrancePerformance ? (
            <div className="space-y-4">
              <div className="ql-leaderboard-table">
                <div className="ql-table-header">
                  <span>Subject</span>
                  <span>Exams Taken</span>
                  <span>Average Score</span>
                  <span>Highest Score</span>
                </div>
                {Object.entries(entrancePerformance.subjectStats).map(([subject, stats]) => (
                  <div key={subject} className="ql-table-row">
                    <span className="capitalize">{subject}</span>
                    <span>{stats.examsTaken}</span>
                    <span>{stats.averageScore}%</span>
                    <span>{stats.highestScore}%</span>
                  </div>
                ))}
              </div>
              {entrancePerformance.recentExams.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Recent Exams</h3>
                  <div className="space-y-2">
                    {entrancePerformance.recentExams.map((exam, index) => (
                      <div key={index} className="border p-3 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">{exam.subject}</span>
                          <span className="font-bold">{exam.percentage}%</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {exam.year} • {exam.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>No entrance exam data available for this student</p>
          )}
        </div>

        {/* Progress Tracking */}
        {progressData && (
          <div className="ql-subject-board">
            <h2 className="text-xl font-bold mb-4">Progress Tracking</h2>
            {progressData.subjectProgress && Object.keys(progressData.subjectProgress).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(progressData.subjectProgress).map(([subject, levels]) => (
                  <div key={subject} className="border p-3 rounded">
                    <h4 className="font-medium capitalize">{subject}</h4>
                    <p>Levels Unlocked: {levels.length}</p>
                    <p>Highest Level: {Math.max(...levels)}</p>
                    <div className="ql-progress-bar mt-2">
                      <div 
                        className="ql-progress-fill" 
                        style={{ width: `${(Math.max(...levels) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No progress data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile