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
        console.log('Frontend received activities:', response.data);
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

// ... (Rest of the file remains unchanged)

const ExamsContent = ({ setQuickActionView, assignedSubject }) => {
  const [exams, setExams] = useState([]);
  const [scores, setScores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchExams = async () => {
    try {
      const response = await axios.get('/api/v1/entrance', {
        headers: { Authorization: ` Bearer ${localStorage.getItem('token')}` },
      });
      setExams(response.data.filter((exam) => exam.subject === assignedSubject));
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchScores = async () => {
    try {
      const response = await axios.get('/api/v1/score', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setScores(response.data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchScores();
  }, [assignedSubject]);

  const subjectExams = exams;
  const recentExams = [...subjectExams]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const years = [...new Set(subjectExams.map((exam) => exam.year))].sort();
  const topScorersByYear = years.map((year) => {
    const yearExams = subjectExams.filter((exam) => exam.year === year);
    const yearScores = scores
      .filter((score) => yearExams.some((exam) => exam._id === score.examId))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((score) => ({
        ...score,
        examTitle: subjectExams.find((exam) => exam._id === score.examId)?.title,
      }));
    return { year, scores: yearScores };
  });

  const examsByYear = years.reduce((acc, year) => {
    acc[year] = subjectExams.filter((exam) => exam.year === year).length;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(examsByYear),
    data: Object.values(examsByYear),
  };

  const filteredExams = subjectExams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.year.includes(searchQuery)
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/entrance/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setExams(exams.filter((exam) => exam._id !== id));
      setScores(scores.filter((score) => score.examId !== id));
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const handleUpdate = (exam) => {
    setQuickActionView(['newExam', { initialData: exam }]);
  };

  const ExamsPieChart = () => {
    useEffect(() => {
      const ctx = document.getElementById('examsPieChart')?.getContext('2d');
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: pieChartData.labels,
          datasets: [
            {
              label: 'Exams',
              data: pieChartData.data,
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
              borderColor: ['#ffffff'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 14 },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.raw} exams`,
              },
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }, []);

    return <canvas id="examsPieChart" aria-label={`Pie chart of ${assignedSubject} exams by year`} />;
  };

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
                    <h4>{exam.title}</h4>
                    <p><strong>Year:</strong> {exam.year}</p>
                    <p><strong>Subject:</strong> {exam.subject}</p>
                    <p><strong>Uploaded:</strong> {new Date(exam.uploadedAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No recent {assignedSubject} exams available.</p>
              )}
            </div>
          </div>
          <div className="analysis-section top-scorers">
            <h3>Highest Scorers by Year</h3>
            {topScorersByYear.length > 0 ? (
              topScorersByYear.map((yearData) => (
                <div key={yearData.year} className="year-scorers">
                  <h4>Year {yearData.year}</h4>
                  {yearData.scores.length > 0 ? (
                    <table className="scorers-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Exam</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearData.scores.map((score, index) => (
                          <tr key={index}>
                            <td>{score.studentName}</td>
                            <td>{score.examTitle}</td>
                            <td>{score.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No {assignedSubject} scores available for {yearData.year}.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No {assignedSubject} scorer data available.</p>
            )}
          </div>
          <div className="analysis-section exams-distribution">
            <h3>Exams by Year</h3>
            {pieChartData.labels.length > 0 ? (
              <div className="pie-chart-container">
                <ExamsPieChart />
              </div>
            ) : (
              <p>No {assignedSubject} exams available.</p>
            )}
          </div>
        </div>
        <div className="exams-table-container">
          <div className="table-controls">
            <input
              type="text"
              placeholder="Search by title or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <table className="exams-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Subject</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <tr key={exam._id}>
                    <td>{exam.title}</td>
                    <td>{exam.year}</td>
                    <td>{exam.subject}</td>
                    <td>
                      <button
                        className="action-button update"
                        onClick={() => handleUpdate(exam)}
                        aria-label={`Update ${exam.title}`}
                      >
                        Update
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(exam._id)}
                        aria-label={`Delete ${exam.title}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No {assignedSubject} exams found.</td>
                </tr>
              )}
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setShortnotes(response.data.filter((note) => note.subject === assignedSubject));
    } catch (error) {
      console.error('Error fetching shortnotes:', error);
    }
  };

  useEffect(() => {
    fetchShortnotes();
  }, [assignedSubject]);

  const subjectShortnotes = shortnotes;
  const recentShortnotes = [...subjectShortnotes]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const filteredShortnotes = subjectShortnotes
    .filter((note) =>
      (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.chapter.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterGrade ? note.grade === filterGrade : true)
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'chapter') return a.chapter.localeCompare(b.chapter);
      if (sortBy === 'grade') return a.grade.localeCompare(b.grade);
      return 0;
    });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setShortnotes(shortnotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Error deleting shortnote:', error);
    }
  };

  const handleUpdate = (note) => {
    setQuickActionView(['addShortnote', { initialData: note }]);
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
                    <h4>{note.title}</h4>
                    <p><strong>Chapter:</strong> {note.chapter}</p>
                    <p><strong>Grade:</strong> {note.grade}</p>
                    <p><strong>Uploaded:</strong> {new Date(note.uploadedAt).toLocaleDateString()}</p>
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
                    <td>{note.chapter}</td>
                    <td>{note.title}</td>
                    <td>{note.grade}</td>
                    <td>
                      <button
                        className="action-button update"
                        onClick={() => handleUpdate(note)}
                        aria-label={`Update ${note.title}`}
                      >
                        Update
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(note._id)}
                        aria-label={`Delete ${note.title}`}
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


