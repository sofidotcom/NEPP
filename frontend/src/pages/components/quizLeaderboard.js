import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/leaderboard/quizleader.css';

const QuizLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overall');
  const [filters, setFilters] = useState({
    subject: '',
    level: '',
    timeRange: 'all'
  });

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view the leaderboard');
      }

      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject.toLowerCase());
      if (filters.level) params.append('level', filters.level);
      if (filters.timeRange !== 'all') params.append('timeRange', filters.timeRange);

      const res = await axios.get(`/api/v1/quizleader?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLeaderboard(res.data.data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to load leaderboard. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleRetry = () => {
    fetchLeaderboard();
  };

  if (loading) return (
    <div className="ql-loading-container">
      <div className="ql-spinner"></div>
    </div>
  );
  if (error) return (
    <div className="ql-error-container">
      {error}
      <button onClick={handleRetry} className="ql-retry-btn">Retry</button>
    </div>
  );

  return (
    <div className="ql-leaderboard-page">
      <div className="ql-leaderboard-container">
        <div className="ql-leaderboard-header">
          <h1>Quiz Leaderboard</h1>
          <div className="ql-leaderboard-filters">
            <select 
              name="subject" 
              value={filters.subject} 
              onChange={handleFilterChange}
            >
              <option value="">All Subjects</option>
              <option value="biology">Biology</option>
              <option value="math">Math</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
            </select>
            <select 
              name="level" 
              value={filters.level} 
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
            <select 
              name="timeRange" 
              value={filters.timeRange} 
              onChange={handleFilterChange}
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
        </div>

        <div className="ql-leaderboard-tabs">
          {['overall', 'subjects', 'levels', 'levelsUnlocked', 'trends'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
              disabled={tab !== 'overall' && !leaderboard[tab === 'subjects' ? 'bySubject' : tab === 'levels' ? 'byLevel' : tab === 'levelsUnlocked' ? 'byLevelsUnlocked' : tab]}
            >
              {tab === 'levelsUnlocked' ? 'Levels Unlocked' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="ql-leaderboard-content">
          {activeTab === 'overall' && <OverallLeaderboard data={leaderboard.overall} />}
          {activeTab === 'subjects' && leaderboard.bySubject && <SubjectLeaderboard data={leaderboard.bySubject} />}
          {activeTab === 'levels' && leaderboard.byLevel && <LevelLeaderboard data={leaderboard.byLevel} />}
          {activeTab === 'levelsUnlocked' && leaderboard.byLevelsUnlocked && <LevelsUnlockedLeaderboard data={leaderboard.byLevelsUnlocked} />}
          {activeTab === 'trends' && <ProgressTrends data={leaderboard.trends} />}
        </div>
      </div>
    </div>
  );
};

const OverallLeaderboard = ({ data }) => (
  <div className="ql-leaderboard-table">
    <h2>Overall Top Performers</h2>
    <div className="ql-table-header">
      <span>Rank</span>
      <span>Student</span>
      <span>Avg Score</span>
      <span>Quizzes</span>
      <span>Subjects</span>
      <span>Levels</span>
    </div>
    {data && data.map((student, index) => (
      <div key={student.id} className="ql-table-row">
        <span className={`ql-rank ql-rank-${index < 3 ? index : 'default'}`}>
          {index + 1}
        </span>
        <div className="ql-student">
          <div className="ql-avatar">{student.name.charAt(0)}</div>
          <div>
            <div className="ql-name">{student.name}</div>
          </div>
        </div>
        <div className="ql-score">
          <div className="ql-progress-bar">
            <div 
              className="ql-progress-fill" 
              style={{ width: `${student.averageScore}%` }}
            ></div>
          </div>
          {student.averageScore}%
        </div>
        <span>{student.totalQuizzes}</span>
        <span>{student.subjects.length}</span>
        <span>{student.levelsCompleted}</span>
      </div>
    ))}
  </div>
);

const SubjectLeaderboard = ({ data }) => (
  <div className="ql-subject-leaderboards">
    {Object.entries(data).map(([subject, students]) => (
      <div key={subject} className="ql-subject-board">
        <h3>{subject.charAt(0).toUpperCase() + subject.slice(1)}</h3>
        <div className="ql-leaderboard-table">
          <div className="ql-table-header">
            <span>Rank</span>
            <span>Student</span>
            <span>Highest Score</span>
            <span>Levels</span>
          </div>
          {students.map((student, index) => (
            <div key={student.studentId} className="ql-table-row">
              <span className={`ql-rank ql-rank-${index < 3 ? index : 'default'}`}>
                {index + 1}
              </span>
              <span className="ql-student">{student.name}</span>
              <span className="ql-score">{student.highestScore}%</span>
              <span>{student.levelsCompleted}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const LevelLeaderboard = ({ data }) => (
  <div className="ql-level-leaderboards">
    {Object.entries(data).map(([subject, levels]) => (
      <div key={subject} className="ql-subject-levels">
        <h3>{subject.charAt(0).toUpperCase() + subject.slice(1)}</h3>
        {Object.entries(levels).map(([level, scores]) => (
          <div key={level} className="ql-level-board">
            <h4>Level {level}</h4>
            <div className="ql-leaderboard-table">
              <div className="ql-table-header">
                <span>Rank</span>
                <span>Student</span>
                <span>Score</span>
                <span>Date</span>
              </div>
              {scores.map((score, index) => (
                <div key={score.studentId} className="ql-table-row">
                  <span className={`ql-rank ql-rank-${index < 3 ? index : 'default'}`}>
                    {index + 1}
                  </span>
                  <span className="ql-student">{score.name}</span>
                  <span className="ql-score">
                    {score.score}/{score.totalQuestions} ({score.percentage}%)
                  </span>
                  <span>{new Date(score.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

const LevelsUnlockedLeaderboard = ({ data }) => (
  <div className="ql-levels-unlocked-leaderboards">
    <div className="ql-overall-unlocked">
      <h2>Most Levels Unlocked Overall</h2>
      <div className="ql-leaderboard-table">
        <div className="ql-table-header">
          <span>Rank</span>
          <span>Student</span>
          <span>Total Levels</span>
          <span>Subjects</span>
        </div>
        {data.overall.map((student, index) => (
          <div key={student.id} className="ql-table-row">
            <span className={`ql-rank ql-rank-${index < 3 ? index : 'default'}`}>
              {index + 1}
            </span>
            <div className="ql-student">
              <div className="ql-avatar">{student.name.charAt(0)}</div>
              <div>
                <div className="ql-name">{student.name}</div>
              </div>
            </div>
            <span>{student.totalLevelsUnlocked}</span>
            <span>{student.subjects.length}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="ql-subject-unlocked">
      <h2>Most Levels Unlocked by Subject</h2>
      {Object.entries(data.bySubject).map(([subject, students]) => (
        <div key={subject} className="ql-subject-board">
          <h3>{subject.charAt(0).toUpperCase() + subject.slice(1)}</h3>
          <div className="ql-leaderboard-table">
            <div className="ql-table-header">
              <span>Rank</span>
              <span>Student</span>
              <span>Levels Unlocked</span>
            </div>
            {students.map((student, index) => (
              <div key={student.id} className="ql-table-row">
                <span className={`ql-rank ql-rank-${index < 3 ? index : 'default'}`}>
                  {index + 1}
                </span>
                <span className="ql-student">{student.name}</span>
                <span>{student.levelsUnlocked}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProgressTrends = ({ data }) => (
  <div className="ql-trends-container">
    <h3>Score Improvement Trends</h3>
    <div className="ql-trend-cards">
      {data && data.map((student, index) => (
        <div key={index} className="ql-trend-card">
          <div className="ql-student-header">
            <div className="ql-avatar">{student.name.charAt(0)}</div>
            <div>
              <div className="ql-name">{student.name}</div>
            </div>
          </div>
          <div className="ql-trend-details">
            <div className="ql-trend-item">Improvement: <span className="ql-highlight">+{student.improvement}%</span></div>
            <div className="ql-trend-item">Latest Score: {student.latestScore}%</div>
            <div className="ql-trend-item">Previous Score: {student.previousScore}%</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default QuizLeaderboard;