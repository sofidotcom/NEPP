import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/admin.css";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Component for Dashboard (Analytics Overview, Recent Activities, System Notifications)
const DashboardContent = ({
  studentCount,
  studentCountLoading,
  studentCountError,
  teacherCount,
  teacherCountLoading,
  teacherCountError,
  chatRoomCount,
  chatRoomCountLoading,
  chatRoomCountError,
  chartData,
  chartDataError
}) => (
  <div>
    <section className="analytics">
      <h2>Analytics Overview</h2>
      <div className="analytics-cards">
        <div className="card">
          Total students: {studentCountLoading ? "Loading..." : studentCountError ? studentCountError : studentCount}
        </div>
        <div className="card">Active students: 938</div>
        <div className="card">
          Total teachers: {teacherCountLoading ? "Loading..." : teacherCountError ? teacherCountError : teacherCount}
        </div>
        <div className="card">Total questions posted: 1000</div>
        <div className="card">Total tips: 8789</div>
        <div className="card">
          Total chatrooms: {chatRoomCountLoading ? "Loading..." : chatRoomCountError ? chatRoomCountError : chatRoomCount}
        </div>
      </div>
      <div className="analytics-chart">
        {chartDataError ? (
          <p>Error loading chart: {chartDataError}</p>
        ) : (
          <Line
            data={chartData}
            options={{
              scales: {
                y: {
                  ticks: {
                    stepSize: 10,
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        )}
      </div>
    </section>
    <section className="recent-activities">
      <h2>Recent Activities</h2>
      <ul>
        <li>No recent activities available.</li>
      </ul>
    </section>
    <section className="system-notifications">
      <h2>System Notifications</h2>
      <ul>
        <li>No notifications available.</li>
      </ul>
    </section>
  </div>
);

// Component for Student Management
const StudentManagementContent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateData, setUpdateData] = useState({ id: '', password: '' });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('/api/v1/signup/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter only students with role 'student'
        const filteredStudents = response.data.students.filter(student => student.role === 'student');
        setStudents(filteredStudents);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch students. Please try again later.');
        setLoading(false);
        console.error('Error fetching students:', err);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/v1/signup/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter(student => student._id !== id));
    } catch (err) {
      setError('Failed to delete student');
      console.error('Error deleting student:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/v1/signup/${updateData.id}`, {
        password: updateData.password
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowUpdateForm(false);
      setUpdateData({ id: '', password: '' });
      setError('');
      alert('Password updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      console.error('Error updating password:', err);
    }
  };

  const openUpdateForm = (student) => {
    setUpdateData({
      id: student._id,
      password: ''
    });
    setShowUpdateForm(true);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-section">
      <h2>Student Management</h2>
      <div className="content-card">
        <div className="header-section">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading-container">Loading students...</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="table-row">
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phoneNumber}</td>
                    <td className={`role ${student.role}`}>
                      {student.role}
                    </td>
                    <td className="actions">
                      <button 
                        onClick={() => openUpdateForm(student)}
                        className="update-button"
                      >
                        Update Password
                      </button>
                      <button 
                        onClick={() => handleDelete(student._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No students found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {showUpdateForm && (
          <div className="update-form-container">
            <h3>Update Student Password</h3>
            <form onSubmit={handleUpdate} className="update-form">
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={updateData.password}
                  onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <button type="submit" className="submit-button">Update</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowUpdateForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for Teacher Management
const TeacherManagementContent = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({ id: "", password: "", subject: "" });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/teacher/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.teachers);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/v1/teacher/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(teachers.filter((teacher) => teacher._id !== id));
      } catch (error) {
        setError(error.response?.data?.message || "Error deleting teacher");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/v1/teacher/${updateData.id}`, {
        password: updateData.password,
        subject: updateData.subject,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(
        teachers.map((teacher) =>
          teacher._id === updateData.id ? { ...teacher, ...res.data.teacher } : teacher
        )
      );
      setShowUpdateForm(false);
      setUpdateData({ id: "", password: "", subject: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Error updating teacher");
    }
  };

  const openUpdateForm = (teacher) => {
    setUpdateData({
      id: teacher._id,
      password: "",
      subject: teacher.subject,
    });
    setShowUpdateForm(true);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-section">
      <h2>Teacher Management</h2>
      <div className="content-card">
        <div className="header-section">
          <button
            onClick={() => navigate('/sign')}
            className="add-button"
          >
            Add New Teacher
          </button>
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading-container">Loading...</p>
        ) : (
          <table className="teacher-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Subject</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="table-row">
                    <td>{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>********</td>
                    <td>{teacher.subject}</td>
                    <td className="actions">
                      <button
                        className="update-button"
                        onClick={() => openUpdateForm(teacher)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(teacher._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No teachers found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {showUpdateForm && (
          <div className="update-form-container">
            <h3>Update Teacher</h3>
            <form onSubmit={handleUpdate} className="update-form">
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={updateData.password}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, password: e.target.value })
                  }
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={updateData.subject}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, subject: e.target.value })
                  }
                  placeholder="Enter subject"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Update
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowUpdateForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for Chatroom Management
const ChatroomManagementContent = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        // Log token for debugging
        console.log("Token for chat rooms request:", token);
        try {
          // Attempt to decode token (client-side, for debugging only)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          console.log("Decoded token payload:", JSON.parse(jsonPayload));
        } catch (decodeErr) {
          console.error("Error decoding token:", decodeErr);
        }

        const response = await axios.get("/api/v1/chat/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChatRooms(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
        setError("Failed to load chat rooms. Please try again.");
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this chat room?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/v1/chat/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatRooms(chatRooms.filter((room) => room._id !== roomId));
    } catch (err) {
      console.error("Error deleting chat room:", err);
      const errorMessage = err.response?.status === 403
        ? "You do not have permission to delete chat rooms. Please ensure you are logged in as an admin."
        : "Failed to delete chat room. Please try again.";
      setError(errorMessage);
    }
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-section">
      <h2>Chatroom Management</h2>
      <div className="content-card">
        <div className="header-section">
          <input
            type="text"
            placeholder="Search chat rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading-container">Loading chat rooms...</p>
        ) : (
          <div className="chatroom-grid">
            {filteredChatRooms.length === 0 ? (
              <div className="no-results">No chat rooms available.</div>
            ) : (
              filteredChatRooms.map((room) => (
                <div key={room._id} className="chatroom-card">
                  <h3 className="chatroom-name">{room.name}</h3>
                  <p className="chatroom-subject">Subject: {room.subject}</p>
                  {room.description && <p className="chatroom-description">{room.description}</p>}
                  <p className="chatroom-date">Created: {new Date(room.createdAt).toLocaleDateString()}</p>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Component for Settings
const SettingsContent = () => (
  <div className="content-section">
    <h2>Settings</h2>
    <div className="content-card">
      <p>Configure system settings and preferences.</p>
      {/* Add settings functionality here */}
    </div>
  </div>
);

// Component for Activity Log
const ActivityLogContent = () => (
  <div className="content-section">
    <h2>Activity Log</h2>
    <div className="content-card">
      <p>View recent administrative actions and system logs.</p>
      {/* Add activity log functionality here */}
    </div>
  </div>
);

// Component for Help
const HelpContent = () => (
  <div className="content-section">
    <h2>Help</h2>
    <div className="content-card">
      <p>Access documentation and support resources.</p>
      {/* Add help content here */}
    </div>
  </div>
);

// Component for Support
const SupportContent = () => (
  <div className="content-section">
    <h2>Support</h2>
    <div className="content-card">
      <p>Contact support or submit a ticket.</p>
      {/* Add support functionality here */}
    </div>
  </div>
);

// Sidebar Component
const Sidebar = ({ setView, currentView }) => (
  <aside className="superadmin-sidebar">
    <nav>
      <button
        className={currentView === "dashboard" ? "active" : ""}
        onClick={() => setView("dashboard")}
      >
        Dashboard
      </button>
      <button
        className={currentView === "student-management" ? "active" : ""}
        onClick={() => setView("student-management")}
      >
        Student Management
      </button>
      <button
        className={currentView === "teacher-management" ? "active" : ""}
        onClick={() => setView("teacher-management")}
      >
        Teacher Management
      </button>
      <button
        className={currentView === "chatroom-management" ? "active" : ""}
        onClick={() => setView("chatroom-management")}
      >
        Chatroom Management
      </button>
      <button
        className={currentView === "settings" ? "active" : ""}
        onClick={() => setView("settings")}
      >
        Settings
      </button>
      <button
        className={currentView === "activity-log" ? "active" : ""}
        onClick={() => setView("activity-log")}
      >
        Activity Log
      </button>
      <button
        className={currentView === "help" ? "active" : ""}
        onClick={() => setView("help")}
      >
        Help
      </button>
      <button
        className={currentView === "support" ? "active" : ""}
        onClick={() => setView("support")}
      >
        Support
      </button>
      <button
        className={currentView === "logout" ? "active" : ""}
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </nav>
  </aside>
);

function Admin() {
  // State for current view
  const [view, setView] = useState("dashboard");

  // State for student count
  const [studentCount, setStudentCount] = useState(null);
  const [studentCountLoading, setStudentCountLoading] = useState(true);
  const [studentCountError, setStudentCountError] = useState(null);

  // State for teacher count
  const [teacherCount, setTeacherCount] = useState(null);
  const [teacherCountLoading, setTeacherCountLoading] = useState(true);
  const [teacherCountError, setTeacherCountError] = useState(null);

  // State for chat room count
  const [chatRoomCount, setChatRoomCount] = useState(null);
  const [chatRoomCountLoading, setChatRoomCountLoading] = useState(true);
  const [chatRoomCountError, setChatRoomCountError] = useState(null);

  // State for chart data
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartDataError, setChartDataError] = useState(null);

  // Fetch student count
  useEffect(() => {
    const fetchStudentCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStudentCountError("Please log in to view student count");
        setStudentCountLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/v1/signup/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data.success) {
          setStudentCount(data.count);
        } else {
          throw new Error("Failed to fetch student count");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setStudentCountError("Session expired. Please log in again.");
          window.location.href = "/login";
        } else {
          setStudentCountError(err.message);
        }
      } finally {
        setStudentCountLoading(false);
      }
    };

    fetchStudentCount();
  }, []);

  // Fetch teacher count
  useEffect(() => {
    const fetchTeacherCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setTeacherCountError("Please log in to view teacher count");
        setTeacherCountLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/v1/teacher/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data.success) {
          setTeacherCount(data.count);
        } else {
          throw new Error("Failed to fetch teacher count");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setTeacherCountError("Session expired. Please log in again.");
          window.location.href = "/login";
        } else {
          setTeacherCountError(err.message);
        }
      } finally {
        setTeacherCountLoading(false);
      }
    };

    fetchTeacherCount();
  }, []);

  // Fetch chat room count
  useEffect(() => {
    const fetchChatRoomCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setChatRoomCountError("Please log in to view chat room count");
        setChatRoomCountLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/v1/chat/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data.success) {
          setChatRoomCount(data.count);
        } else {
          throw new Error("Failed to fetch chat room count");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setChatRoomCountError("Session expired. Please log in again.");
          window.location.href = "/login";
        } else {
          setChatRoomCountError(err.message);
        }
      } finally {
        setChatRoomCountLoading(false);
      }
    };

    fetchChatRoomCount();
  }, []);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setChartDataError("Please log in to view chart data");
        return;
      }

      try {
        const currentYear = new Date().getFullYear();
        const res = await axios.get(`/api/v1/chartData?year=${currentYear}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data.success) {
          if (data.values.some(v => v > 0)) {
            setChartData({
              labels: data.labels,
              datasets: [
                {
                  label: "Total Students",
                  data: data.values,
                  fill: false,
                  borderColor: "rgba(75, 192, 192, 1)",
                  tension: 0.1,
                },
              ],
            });
          } else {
            setChartDataError("No student registrations found for this year");
          }
        } else {
          throw new Error("Failed to fetch chart data");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setChartDataError("Session expired. Please log in again.");
          window.location.href = "/login";
        } else {
          setChartDataError(err.message || "Failed to fetch chart data");
          console.error("Chart data error:", err);
        }
      }
    };

    fetchChartData();
  }, []);

  // Render content based on view
  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return (
          <DashboardContent
            studentCount={studentCount}
            studentCountLoading={studentCountLoading}
            studentCountError={studentCountError}
            teacherCount={teacherCount}
            teacherCountLoading={teacherCountLoading}
            teacherCountError={teacherCountError}
            chatRoomCount={chatRoomCount}
            chatRoomCountLoading={chatRoomCountLoading}
            chatRoomCountError={chatRoomCountError}
            chartData={chartData}
            chartDataError={chartDataError}
          />
        );
      case "student-management":
        return <StudentManagementContent />;
      case "teacher-management":
        return <TeacherManagementContent />;
      case "chatroom-management":
        return <ChatroomManagementContent />;
      case "settings":
        return <SettingsContent />;
      case "activity-log":
        return <ActivityLogContent />;
      case "help":
        return <HelpContent />;
      case "support":
        return <SupportContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="superadmin">
      {/* Header Section */}
      <header className="admin-header">
        <h1>EthioAce Admin Dashboard</h1>
      </header>

      {/* Sidebar */}
      <Sidebar setView={setView} currentView={view} />

      {/* Main Content */}
      <main className="main-cell">
        {renderContent()}
      </main>

      {/* Footer Section */}
      <footer className="admin-footer">
        <p>© 2025 EthioAce. All rights reserved.</p>
        <p></p>
      </footer>
    </div>
  );
}

export default Admin;