import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { formatDistanceToNow } from 'date-fns';
import '../../css/teacherDashbord.css';
import BiologyAddEntrance from './biology/addentranceExam';
import BiologyExam from './biology/addBiologyExam';
import ChatRoom from '../components/chatRoom';
import ChatRoomsList from '../components/chatRoomsList';
import UploadNoteForm from './notePage';
import UploadPDF from './pdfUploadPage';
import axios from 'axios';

const DashboardContent = ({ setQuickActionView }) => {
  const QuickActions = () => (
    <div className="quick-actions">
      <h2>Quick Actions</h2>
      <div className="quick-actions-grid">
        <button
          className="quick-action-button"
          onClick={() => setQuickActionView('newExam')}
        >
          <span>➕</span>
          <span>New Exam</span>
        </button>
        <button
          className="quick-action-button"
          onClick={() => setQuickActionView('uploadMaterial')}
        >
          <span>📤</span>
          <span>Upload Material</span>
        </button>
        <button
          className="quick-action-button"
          onClick={() => setQuickActionView('createQuiz')}
        >
          <span>➕</span>
          <span>Create Quiz</span>
        </button>
        <button
          className="quick-action-button"
          onClick={() => setQuickActionView('addShortnote')}
        >
          <span>📝</span>
          <span>Add Shortnote</span>
        </button>
        <button
          className="quick-action-button"
          onClick={() => setQuickActionView('addTips')}
        >
          <span>💡</span>
          <span>Add Tips</span>
        </button>
        <button
          className="quick-action-button"
          onClick={() => setQuickActionView('Chat')}
        >
          <span>💬</span>
          <span>ChatRoom</span>
        </button>
      </div>
    </div>
  );

  const RecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecentActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/v1/recent-activities', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache'
          }
        });
        setActivities(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        setError('Failed to load recent activities. Please try again.');
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchRecentActivities();
    }, []);

    const getActivityMeta = (activityType) => {
      switch (activityType) {
        case 'note_added':
          return { icon: '📝', color: '#3b82f6', label: 'Note' };
        case 'pdf_added':
          return { icon: '📚', color: '#10b981', label: 'PDF' };
        case 'quiz_added':
          return { icon: '➕', color: '#f59e0b', label: 'Quiz' };
        case 'exam_added':
          return { icon: '📝', color: '#ef4444', label: 'Exam' };
        case 'chatroom_created':
          return { icon: '💬', color: '#8b5cf6', label: 'Chatroom' };
        case 'tip_added':
          return { icon: '💡', color: '#f97316', label: 'Tip' };
        default:
          return { icon: '❓', color: '#6b7280', label: 'Unknown' };
      }
    };

    const handleActivityClick = (activity) => {
      if (activity.resourceId) {
        console.log(`Navigate to resource: ${activity.resourceId}`);
      }
    };

    if (loading) {
      return (
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={fetchRecentActivities}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="recent-activity-list">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const { icon, color, label } = getActivityMeta(activity.activityType);
              return (
                <div
                  key={activity._id}
                  className="recent-activity-item"
                  onClick={() => handleActivityClick(activity)}
                  style={{ cursor: activity.resourceId ? 'pointer' : 'default' }}
                >
                  <div className="item-content">
                    <span style={{ color, fontSize: '1.5rem' }}>{icon}</span>
                    <div className="activity-details">
                      <span className="activity-description">{activity.description}</span>
                      <span className="activity-badge" style={{ backgroundColor: color }}>
                        {label}
                      </span>
                    </div>
                  </div>
                  <p className="activity-timestamp">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center py-4">No recent activities to display.</p>
          )}
        </div>
      </div>
    );
  };

  const AnalysisChart = () => {
    const [chartData, setChartData] = useState({
      chatrooms: 0,
      pdfs: 0,
      quizzes: 0,
      entranceExams: 0,
      tips: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/v1/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setChartData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analysis data:', err);
        setError('Failed to load analysis data. Please try again.');
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchAnalysisData();
    }, []);

    useEffect(() => {
      const ctx = document.getElementById('analysisChart')?.getContext('2d');
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Chatrooms', 'PDFs', 'Quizzes', 'Entrance Exams', 'Tips'],
          datasets: [
            {
              label: 'Count',
              data: [
                chartData.chatrooms,
                chartData.pdfs,
                chartData.quizzes,
                chartData.entranceExams,
                chartData.tips,
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }, [chartData]);

    if (loading) {
      return (
        <div className="analysis">
          <h2>Analysis</h2>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="analysis">
          <h2>Analysis</h2>
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={fetchAnalysisData}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="analysis">
        <h2>Analysis</h2>
        <canvas id="analysisChart" aria-label="Analysis chart of dashboard metrics" />
      </div>
    );
  };

  return (
    <div>
      <QuickActions />
      <RecentActivity />
      <AnalysisChart />
    </div>
  );
};

const ExamsContent = ({ setQuickActionView, assignedSubject }) => {
  const [recentExams, setRecentExams] = useState([]);
  const [topScorersByYear, setTopScorersByYear] = useState({});
  const [overallTopScorers, setOverallTopScorers] = useState([]);
  const [subjectData, setSubjectData] = useState({ activities: [], scores: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent exams
      const recentExamsResponse = await axios.get(`/api/v1/exam-analysis/exams?subject=${assignedSubject}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRecentExams(recentExamsResponse.data);

      // Fetch top scorers by year
      const topScorersByYearResponse = await axios.get(`/api/v1/exam-analysis/top-scorers-year?subject=${assignedSubject}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTopScorersByYear(topScorersByYearResponse.data);

      // Fetch overall top scorers
      const overallTopScorersResponse = await axios.get(`/api/v1/exam-analysis/top-scorers-overall?subject=${assignedSubject}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOverallTopScorers(overallTopScorersResponse.data);

      // Fetch subject activities and scores
      const subjectDataResponse = await axios.get(`/api/v1/exam-analysis/subject-data?subject=${assignedSubject}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSubjectData(subjectDataResponse.data);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError('Failed to load exam data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignedSubject) {
      fetchExamData();
    }
  }, [assignedSubject]);

  const YearPieChart = ({ year, scorers, chartId }) => {
    useEffect(() => {
      const ctx = document.getElementById(chartId)?.getContext('2d');
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: scorers.map(scorer => scorer.name),
          datasets: [{
            label: `Top Scorers ${year}`,
            data: scorers.map(scorer => scorer.percentage),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 14 } },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.raw.toFixed(2)}%`,
              },
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }, [scorers]);

    return <canvas id={chartId} aria-label={`Pie chart of top scorers for ${year}`} />;
  };

  const OverallPieChart = ({ scorers, chartId }) => {
    useEffect(() => {
      const ctx = document.getElementById(chartId)?.getContext('2d');
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: scorers.map(scorer => scorer.name),
          datasets: [{
            label: 'Overall Top Scorers',
            data: scorers.map(scorer => scorer.percentage),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 14 } },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.raw.toFixed(2)}%`,
              },
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }, [scorers]);

    return <canvas id={chartId} aria-label="Pie chart of overall top scorers" />;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/entrance/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRecentExams(recentExams.filter(exam => exam._id !== id));
      setSubjectData({
        ...subjectData,
        activities: subjectData.activities.filter(activity => activity.resourceId !== id),
        scores: subjectData.scores.filter(score => score.examId !== id),
      });
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const handleUpdate = (exam) => {
    setQuickActionView(['newExam', { initialData: exam }]);
  };

  if (loading) {
    return (
      <div className="content-section">
        <h2>{assignedSubject} Exams</h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <h2>{assignedSubject} Exams</h2>
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={fetchExamData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <h2>{assignedSubject} Exams</h2>
      <div className="content-card">
        <button
          className="upload-button"
          onClick={() => setQuickActionView('newExam')}
        >
          Upload Exam
        </button>
        <div className="exams-analysis">
          <div className="analysis-section recent-exams">
            <h3>Most Recently Added Exams</h3>
            <div className="recent-exams-grid">
              {recentExams.length > 0 ? (
                recentExams.map((exam) => (
                  <div key={exam._id} className="recent-exam-card" tabIndex="0">
                    <h4>{exam.description}</h4>
                    <p><strong>Subject:</strong> {assignedSubject}</p>
                    <p><strong>Uploaded:</strong> {new Date(exam.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No recent {assignedSubject} exams available.</p>
              )}
            </div>
          </div>
          <div className="analysis-section top-scorers">
            <h3>Top Scorers by Year</h3>
            <div className="pie-charts-grid">
              {['2014', '2015', '2016'].map((year) => (
                <div key={year} className="year-pie-chart">
                  <h4>Year {year}</h4>
                  {topScorersByYear[year]?.length > 0 ? (
                    <YearPieChart
                      year={year}
                      scorers={topScorersByYear[year]}
                      chartId={`yearPieChart${year}`}
                    />
                  ) : (
                    <p>No scorers available for {year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="analysis-section overall-scorers">
            <h3>Overall Top Scorers</h3>
            {overallTopScorers.length > 0 ? (
              <div className="pie-chart-container">
                <OverallPieChart
                  scorers={overallTopScorers}
                  chartId="overallPieChart"
                />
              </div>
            ) : (
              <p>No overall scorers available</p>
            )}
          </div>
        </div>
        <div className="subject-data-section">
          <h3>Subject Scores</h3>
          <div className="scores-section">
            {subjectData.scores.length > 0 ? (
              <table className="scores-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Year</th>
                    <th>Score</th>
                    <th>Total Questions</th>
                    <th>Percentage</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectData.scores.map((score) => (
                    <tr key={score._id}>
                      <td>{score.studentName}</td>
                      <td>{score.year}</td>
                      <td>{score.score}</td>
                      <td>{score.totalQuestions}</td>
                      <td>{score.percentage.toFixed(2)}%</td>
                      <td>{new Date(score.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No scores available</p>
            )}
          </div>
        </div>
        <div className="exams-table-container">
          <div className="table-controls">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <table className="exams-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Subject</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentExams
                .filter((exam) =>
                  exam.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((exam) => (
                  <tr key={exam._id}>
                    <td>{exam.description}</td>
                    <td>{assignedSubject}</td>
                    <td>{new Date(exam.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="action-button update"
                        onClick={() => handleUpdate(exam)}
                        aria-label={`Update ${exam.description}`}
                      >
                        Update
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(exam._id)}
                        aria-label={`Delete ${exam.description}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const ShortnotesContent = ({ setQuickActionView, assignedSubject }) => {
  const [shortnotes, setShortnotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterGrade, setFilterGrade] = useState('');

  const fetchShortnotes = async () => {
    try {
      const response = await axios.get('/api/v1/notes', {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache'
        },
      });
      const filteredNotes = response.data.filter((note) => note.subject === assignedSubject);
      setShortnotes(filteredNotes);
    } catch (error) {
      console.error('Error fetching shortnotes:', error);
    }
  };

  useEffect(() => {
    if (assignedSubject) {
      fetchShortnotes();
    }
  }, [assignedSubject]);

  const subjectShortnotes = shortnotes;
  const recentShortnotes = [...subjectShortnotes]
    .sort((a, b) => {
      const dateA = a.uploadedAt ? new Date(a.uploadedAt) : new Date(0);
      const dateB = b.uploadedAt ? new Date(b.uploadedAt) : new Date(0);
      return dateB - dateA;
    })
    .slice(0, 4);

  const filteredShortnotes = subjectShortnotes
    .filter((note) =>
      (note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.chapter?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterGrade ? note.grade === filterGrade : true)
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title?.localeCompare(b.title) || 0;
      if (sortBy === 'chapter') return a.chapter?.localeCompare(b.chapter) || 0;
      if (sortBy === 'grade') return a.grade?.localeCompare(b.grade) || 0;
      return 0;
    });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setShortnotes(shortnotes.filter((note) => note._id !== id));
      fetchShortnotes();
    } catch (error) {
      console.error('Error deleting shortnote:', error);
    }
  };

  const handleUpdate = (note) => {
    setQuickActionView(['addShortnote', { initialData: note }]);
  };

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'Date unavailable';
    }
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="content-section">
      <h2>{assignedSubject} Shortnotes</h2>
      <div className="content-card">
        <button
          className="upload-button"
          onClick={() => setQuickActionView('addShortnote')}
        >
          Add Shortnote
        </button>
        <div className="shortnotes-analysis">
          <div className="analysis-section recent-shortnotes">
            <h3>Most Recently Added Shortnotes</h3>
            <div className="recent-shortnotes-grid">
              {recentShortnotes.length > 0 ? (
                recentShortnotes.map((note) => (
                  <div key={note._id} className="recent-shortnote-card" tabIndex="0">
                    <h4>{note.title || 'Untitled'}</h4>
                    <p><strong>Chapter:</strong> {note.chapter || 'N/A'}</p>
                    <p><strong>Grade:</strong> {note.grade || 'N/A'}</p>
                  </div>
                ))
              ) : (
                <p>No recent {assignedSubject} shortnotes available.</p>
              )}
            </div>
          </div>
        </div>
        <div className="shortnotes-table-container">
          <div className="table-controls">
            <input
              type="text"
              placeholder="Search by title or chapter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="filter-controls">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="title">Sort by Title</option>
                <option value="chapter">Sort by Chapter</option>
                <option value="grade">Sort by Grade</option>
              </select>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="filter-select"
              >
                <option value="">All Grades</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
          </div>
          <table className="shortnotes-table">
            <thead>
              <tr>
                <th>Chapter</th>
                <th>Title</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShortnotes.length > 0 ? (
                filteredShortnotes.map((note) => (
                  <tr key={note._id}>
                    <td>{note.chapter || 'N/A'}</td>
                    <td>{note.title || 'Untitled'}</td>
                    <td>{note.grade || 'N/A'}</td>
                    <td>
                      <button
                        className="action-button update"
                        onClick={() => handleUpdate(note)}
                        aria-label={`Update ${note.title || 'shortnote'}`}
                      >
                        Update
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(note._id)}
                        aria-label={`Delete ${note.title || 'shortnote'}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No {assignedSubject} shortnotes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PDFsContent = ({ setQuickActionView, assignedSubject }) => {
  const [pdfs, setPdfs] = useState([]);

  const fetchPdfs = async () => {
    try {
      const response = await axios.get('/api/v1/uploadedPdf', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPdfs(response.data.filter((pdf) => pdf.subject === assignedSubject));
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, [assignedSubject]);

  const subjectPdfs = pdfs;
  const recentPdfs = [...subjectPdfs]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const popularPdfs = [...subjectPdfs]
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 3);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/uploadedPdf/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPdfs(pdfs.filter((pdf) => pdf._id !== id));
    } catch (error) {
      console.error('Error deleting PDF:', error);
    }
  };

  const handleUpdate = (id) => {
    setQuickActionView('uploadMaterial');
  };

  const DownloadPieChart = () => {
    useEffect(() => {
      const ctx = document.getElementById('downloadPieChart')?.getContext('2d');
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: popularPdfs.map((pdf) => pdf.title),
          datasets: [{
            label: 'Downloads',
            data: popularPdfs.map((pdf) => pdf.downloads || 0),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.raw} downloads`,
              },
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }, []);

    return <canvas id="downloadPieChart" aria-label={`Pie chart of most downloaded ${assignedSubject} PDFs`} />;
  };

  return (
    <div className="content-section">
      <h2>{assignedSubject} PDFs</h2>
      <div className="content-card">
        <button
          className="upload-button"
          onClick={() => setQuickActionView('uploadMaterial')}
        >
          Upload PDF
        </button>
        <div className="pdf-analysis">
          <div className="analysis-section recent-books">
            <h3>Most Recently Added Books</h3>
            <div className="recent-books-grid">
              {recentPdfs.length > 0 ? (
                recentPdfs.map((pdf) => (
                  <div key={pdf._id} className="recent-book-card" tabIndex="0">
                    <h4>{pdf.title}</h4>
                    <p><strong>Subject:</strong> {pdf.subject}</p>
                    <p><strong>Uploaded:</strong> {new Date(pdf.uploadedAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No recent {assignedSubject} PDFs available.</p>
              )}
            </div>
          </div>
          <div className="analysis-section popular-books">
            <h3>Most Downloaded Books</h3>
            {popularPdfs.length > 0 ? (
              <div className="pie-chart-container">
                <DownloadPieChart />
              </div>
            ) : (
              <p>No popular {assignedSubject} PDFs available.</p>
            )}
          </div>
        </div>
        <div className="pdf-table-container">
          <table className="pdf-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Downloads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjectPdfs.length > 0 ? (
                subjectPdfs.map((pdf) => (
                  <tr key={pdf._id}>
                    <td>{pdf.title}</td>
                    <td>{pdf.subject}</td>
                    <td>{pdf.downloads || 0}</td>
                    <td>
                      <button
                        className="action-button update"
                        onClick={() => handleUpdate(pdf._id)}
                        aria-label={`Update ${pdf.title}`}
                      >
                        Update
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(pdf._id)}
                        aria-label={`Delete ${pdf.title}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No {assignedSubject} PDFs uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const QuizzesContent = () => (
  <div className="content-section">
    <h2>Quizzes</h2>
    <div className="content-card">
      <p>No quizzes created yet.</p>
      <button className="upload-button">Create New Quiz</button>
    </div>
  </div>
);

const TipsContent = () => (
  <div className="content-section">
    <h2>Tips</h2>
    <div className="content-card">
      <p>No tips added yet.</p>
      <button className="upload-button">Add New Tip</button>
    </div>
  </div>
);

const ChatbotContent = () => (
  <div className="content-section">
    <h2>Chatbot</h2>
    <div className="content-card">
      <p>Chatbot is ready to assist you!</p>
      <button className="upload-button">Start Chat</button>
    </div>
  </div>
);

const ChatContent = () => (
  <div className="content-section">
    <h2>Chat Rooms</h2>
    <div className="content-card">
      <ChatRoomsList />
    </div>
  </div>
);

const Sidebar = ({ setView, currentView }) => (
  <div className="sidebar">
    <ul>
      <li
        className={currentView === 'dashboard' ? 'active' : ''}
        onClick={() => setView('dashboard')}
      >
        <span>📊</span>
        <span>Dashboard</span>
      </li>
      <li
        className={currentView === 'exams' ? 'active' : ''}
        onClick={() => setView('exams')}
      >
        <span>📝</span>
        <span>Exams</span>
      </li>
      <li
        className={currentView === 'shortnotes' ? 'active' : ''}
        onClick={() => setView('shortnotes')}
      >
        <span>📝</span>
        <span>Shortnotes</span>
      </li>
      <li
        className={currentView === 'pdfs' ? 'active' : ''}
        onClick={() => setView('pdfs')}
      >
        <span>📚</span>
        <span>PDFs</span>
      </li>
      <li
        className={currentView === 'quizzes' ? 'active' : ''}
        onClick={() => setView('quizzes')}
      >
        <span>➕</span>
        <span>Quizzes</span>
      </li>
      <li
        className={currentView === 'tips' ? 'active' : ''}
        onClick={() => setView('tips')}
      >
        <span>💡</span>
        <span>Tips</span>
      </li>
      <li
        className={currentView === 'chatbot' ? 'active' : ''}
        onClick={() => setView('chatbot')}
      >
        <span>💬</span>
        <span>Chatbot</span>
      </li>
    </ul>
  </div>
);

const TeacherBoard = () => {
  const [view, setView] = useState('dashboard');
  const [quickActionView, setQuickActionView] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`/api/v1/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const renderContent = () => {
    if (quickActionView) {
      const action = Array.isArray(quickActionView) ? quickActionView[0] : quickActionView;
      const params = Array.isArray(quickActionView) ? quickActionView[1] : {};

      switch (action) {
        case 'newExam':
          return <BiologyAddEntrance initialData={params.initialData} />;
        case 'uploadMaterial':
          return <UploadPDF />;
        case 'createQuiz':
          return <BiologyExam />;
        case 'addShortnote':
          return <UploadNoteForm initialData={params.initialData} />;
        case 'Chat':
          return <ChatContent />;
        default:
          return <DashboardContent setQuickActionView={setQuickActionView} />;
      }
    }

    switch (view) {
      case 'dashboard':
        return <DashboardContent setQuickActionView={setQuickActionView} />;
      case 'exams':
        return <ExamsContent 
                 setQuickActionView={setQuickActionView} 
                 assignedSubject={profile?.subject} 
               />;
      case 'shortnotes':
        return <ShortnotesContent 
                 setQuickActionView={setQuickActionView} 
                 assignedSubject={profile?.subject} 
               />;
      case 'pdfs':
        return <PDFsContent 
                 setQuickActionView={setQuickActionView} 
                 assignedSubject={profile?.subject} 
               />;
      case 'quizzes':
        return <QuizzesContent />;
      case 'tips':
        return <TipsContent />;
      case 'chatbot':
        return <ChatbotContent />;
      default:
        return <DashboardContent setQuickActionView={setQuickActionView} />;
    }
  };

  const handleSidebarClick = (newView) => {
    setView(newView);
    setQuickActionView(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load profile. Please try again later.</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchProfile}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="teacher-board">
      <header className="header">
        <div className="logo">
          <span>🎓</span>
          <span>EthioAce</span>
        </div>
        <div className="header-actions">
          <div className="notification">
            <span>🔔</span>
            <span className="notification-badge">3</span>
          </div>
          <div className="profile">
            <span className="profile-icon" onClick={toggleProfileDropdown}>
              👤
            </span>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phoneNumber || 'N/A'}</p>
                <p><strong>Assigned Subject:</strong> {profile.subject}</p>
              </div>
            )}
          </div>
        </div>
      </header>
      <Sidebar setView={handleSidebarClick} currentView={view} />
      <main className="main">{renderContent()}</main>
    </div>
  );
};

export default TeacherBoard;
