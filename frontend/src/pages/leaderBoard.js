import React, { useState } from 'react';
import '../css/leaderBoard.css';

// Utility Components
const FilterDropdown = ({ label, options, value, onChange }) => (
  <div className="filter-dropdown">
    {label && <label>{label}</label>}
    <select value={value} onChange={onChange}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Badge = ({ children, type = 'default' }) => (
  <span className={`badge badge-${type}`}>{children}</span>
);

// Main Components
const EntranceExamTopScorers = ({ users, search, filters, onFilterChange }) => {
  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
  const years = ['All', '2023', '2022', '2021', '2020'];

  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (filters.entranceSubject === 'All' || user.subject === filters.entranceSubject) &&
      (filters.entranceYear === 'All' || user.year === filters.entranceYear)
    )
    .sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard-section">
      <div className="section-header">
        <h2><i className="icon-trophy"></i> Entrance Exam Top Scorers</h2>
        <div className="section-filters">
          <FilterDropdown
            label="Subject:"
            options={subjects.map(subject => ({ value: subject, label: subject }))}
            value={filters.entranceSubject}
            onChange={(e) => onFilterChange('entranceSubject', e.target.value)}
          />
          <FilterDropdown
            label="Year:"
            options={years.map(year => ({ value: year, label: year }))}
            value={filters.entranceYear}
            onChange={(e) => onFilterChange('entranceYear', e.target.value)}
          />
        </div>
      </div>
      
      <div className="users-list">
        {filteredUsers.map((user, index) => (
          <div key={`${user.id}-entrance`} className="user-card">
            <div className="user-rank">{index + 1}</div>
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-details">
              <h3>{user.name}</h3>
              <div className="user-meta">
                <span>Score: <strong>{user.score}</strong></span>
                <span>Mathematics • 2023</span>
              </div>
              <div className="user-badges">
                {user.badges.map((badge, i) => (
                  <Badge key={i} type="blue">{badge}</Badge>
                ))}
                {user.rising && <Badge type="green">Rising Star</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuizTopScorers = ({ users, search, filters, onFilterChange }) => {
  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
  const levels = ['All', '1', '2', '3', '4', '5'];

  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (filters.quizSubject === 'All' || user.subject === filters.quizSubject) &&
      (filters.quizLevel === 'All' || user.level.toString() === filters.quizLevel)
    )
    .sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard-section">
      <div className="section-header">
        <h2><i className="icon-puzzle"></i> Quiz Top Scorers</h2>
        <div className="section-filters">
          <FilterDropdown
            label="Subject:"
            options={subjects.map(subject => ({ value: subject, label: subject }))}
            value={filters.quizSubject}
            onChange={(e) => onFilterChange('quizSubject', e.target.value)}
          />
          <FilterDropdown
            label="Level:"
            options={levels.map(level => ({ value: level, label: `Level ${level}` }))}
            value={filters.quizLevel}
            onChange={(e) => onFilterChange('quizLevel', e.target.value)}
          />
        </div>
      </div>
      
      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={`${user.id}-quiz`} className="quiz-card">
            <div className="quiz-card-header">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div>
                <h3>{user.name}</h3>
                <span className="quiz-level">Level {user.level}</span>
              </div>
            </div>
            <div className="quiz-card-body">
              <div className="quiz-score">
                <span>Score</span>
                <strong>{user.score}</strong>
              </div>
              <div className="quiz-meta">
                <span>Mathematics</span>
                <span>{Math.floor(Math.random() * 20) + 5} min</span>
              </div>
            </div>
            {user.level >= 4 && (
              <div className="quiz-card-badge">
                <Badge type="purple">High Achiever</Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ActiveLearners = ({ users, search }) => {
  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.activeHours - a.activeHours);

  return (
    <div className="leaderboard-section">
      <h2><i className="icon-clock"></i> Most Active Learners</h2>
      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={`${user.id}-active`} className="user-card">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-details">
              <h3>{user.name}</h3>
              <div className="active-hours">
                <i className="icon-clock"></i>
                <span>{user.activeHours} hours</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopHelpers = ({ users, search }) => {
  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.contributions - a.contributions);

  return (
    <div className="leaderboard-section">
      <h2><i className="icon-help-circle"></i> Top Helpers</h2>
      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={`${user.id}-helper`} className="user-card">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-details">
              <h3>{user.name}</h3>
              <div className="contributions">
                <i className="icon-message-square"></i>
                <span>{user.contributions} answers</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamRankings = ({ teams }) => {
  return (
    <div className="leaderboard-section">
      <h2><i className="icon-users"></i> Team Rankings</h2>
      <div className="teams-list">
        {teams.map((team, index) => (
          <div key={team.id} className="team-card">
            <div className="team-rank">{index + 1}</div>
            <div className="team-avatar">
              {team.name.split(' ').map(w => w[0]).join('')}
            </div>
            <div className="team-details">
              <h3>{team.name}</h3>
              <div className="team-meta">
                <span>Score: {team.score}</span>
                <span>{team.members} members</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserStatsSidebar = ({ currentUser }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-section user-profile">
        <div className="profile-header">
          <img src={currentUser.avatar} alt="Your avatar" className="profile-avatar" />
          <div>
            <h2>Your Stats</h2>
            <p className="profile-rank">Rank #{currentUser.rank}</p>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <i className="icon-star"></i>
            <div>
              <span>Overall Score</span>
              <strong>{currentUser.score}</strong>
            </div>
          </div>
          <div className="stat-card">
            <i className="icon-clock"></i>
            <div>
              <span>Active Hours</span>
              <strong>{currentUser.activeHours}</strong>
            </div>
          </div>
          <div className="stat-card">
            <i className="icon-check"></i>
            <div>
              <span>Level</span>
              <strong>{currentUser.level}</strong>
            </div>
          </div>
          <div className="stat-card">
            <i className="icon-help"></i>
            <div>
              <span>Contributions</span>
              <strong>{currentUser.contributions}</strong>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3><i className="icon-award"></i> Your Badges</h3>
        <div className="badges-container">
          {currentUser.badges.map((badge, index) => (
            <Badge key={index} type="gold">{badge}</Badge>
          ))}
        </div>
      </div>
      
      <div className="sidebar-section progress-section">
        <h3>Your Progress</h3>
        <div className="progress-chart">
          <div className="chart" style={{ '--percentage': '65%' }}>
            <span>65%</span>
          </div>
          <p>to next level</p>
        </div>
        <button className="share-button">
          <i className="icon-share"></i> Share Progress
        </button>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    period: 'All-Time',
    entranceSubject: 'All',
    entranceYear: 'All',
    quizSubject: 'All',
    quizLevel: 'All'
  });

  // Original data
  const users = [
    { id: 1, name: 'Alice Smith', avatar: 'https://via.placeholder.com/50', score: 950, level: 5, badges: ['Quiz Master', 'Study Guru'], activeHours: 120, contributions: 50, rising: false },
    { id: 2, name: 'Bob Johnson', avatar: 'https://via.placeholder.com/50', score: 920, level: 4, badges: ['Quiz Master'], activeHours: 100, contributions: 30, rising: true },
    { id: 3, name: 'Clara Lee', avatar: 'https://via.placeholder.com/50', score: 900, level: 4, badges: ['Study Guru'], activeHours: 150, contributions: 20, rising: false },
    { id: 4, name: 'David Kim', avatar: 'https://via.placeholder.com/50', score: 870, level: 3, badges: [], activeHours: 80, contributions: 10, rising: true },
    { id: 5, name: 'You', avatar: 'https://via.placeholder.com/50', score: 850, level: 3, badges: ['Rising Star'], activeHours: 90, contributions: 15, rising: false }
  ];

  const teams = [
    { id: 1, name: 'Brainiacs', score: 2800, members: 4 },
    { id: 2, name: 'Knowledge Ninjas', score: 2500, members: 3 },
  ];

  const currentUser = users.find(user => user.name === 'You') || users[4];

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <div className="header-content">
          <h1><i className="icon-leaderboard"></i> Exam Practice Leaderboard</h1>
          <p>Track your progress and compete with others</p>
        </div>
        
        <div className="header-controls">
          <div className="search-box">
            <i className="icon-search"></i>
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <FilterDropdown
            options={[
              { value: 'All-Time', label: 'All Time' },
              { value: 'Monthly', label: 'This Month' },
              { value: 'Weekly', label: 'This Week' },
              { value: 'Daily', label: 'Today' }
            ]}
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          />
        </div>
      </header>

      <div className="leaderboard-spotlight">
        <div className="spotlight-content">
          <div className="spotlight-badge">Top Performer</div>
          <h2>{users[0].name}</h2>
          <p>Achieved the highest score this week</p>
          <div className="spotlight-stats">
            <div>
              <span>Rank</span>
              <strong>#1</strong>
            </div>
            <div>
              <span>Score</span>
              <strong>{users[0].score}</strong>
            </div>
            <div>
              <span>Level</span>
              <strong>{users[0].level}</strong>
            </div>
          </div>
        </div>
        <div className="spotlight-avatar">
          <img src={users[0].avatar} alt={users[0].name} />
        </div>
      </div>

      <div className="leaderboard-container">
        <main className="leaderboard-main">
          <EntranceExamTopScorers 
            users={users} 
            search={search} 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <QuizTopScorers 
            users={users} 
            search={search} 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <ActiveLearners users={users} search={search} />
          <TopHelpers users={users} search={search} />
          <TeamRankings teams={teams} />
        </main>
        
        <aside className="leaderboard-sidebar">
          <UserStatsSidebar currentUser={currentUser} />
        </aside>
      </div>
    </div>
  );
};

export default Leaderboard;