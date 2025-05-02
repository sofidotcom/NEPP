import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/admin.css";
import { Link } from 'react-router-dom';
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

function Admin() {
  // State for Sidebar Active Button
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");

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

  // Toggle Active Sidebar
  const handleSidebarClick = (section) => {
    setActiveSidebar(section);
  };

  return (
    <div className="superadmin">
      {/* Header Section */}
      <header className="admin-header">
        <h1>EthioAce Admin Dashboard</h1>
      </header>

      {/* Sidebar Navigation */}
      <aside className="superadmin-sidebar">
        <nav>
          <button
            className={activeSidebar === "Dashboard" ? "active" : ""}
            onClick={() => handleSidebarClick("Dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeSidebar === "student management" ? "active" : ""}
            onClick={() => handleSidebarClick("student management")}
          >
            student management
          </button>
          <button
            className={activeSidebar === "teacher management" ? "active" : ""}
            onClick={() => handleSidebarClick("teacher management")}
          >
            teacher management
          </button>
          <button
            className={activeSidebar === "Question management" ? "active" : ""}
            onClick={() => handleSidebarClick("Question management")}
          >
            Question management
          </button>
          <button
            className={activeSidebar === "Settings" ? "active" : ""}
            onClick={() => handleSidebarClick("Settings")}
          >
            Settings
          </button>
          <button
            className={activeSidebar === "Activity Log" ? "active" : ""}
            onClick={() => handleSidebarClick("Activity Log")}
          >
            Activity Log
          </button>
          <button
            className={activeSidebar === "Help" ? "active" : ""}
            onClick={() => handleSidebarClick("Help")}
          >
            Help
          </button>
          <button
            className={activeSidebar === "Support" ? "active" : ""}
            onClick={() => handleSidebarClick("Support")}
          >
            Support
          </button>
          <button
            className={activeSidebar === "Logout" ? "active" : ""}
            onClick={() => handleSidebarClick("Logout")}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-cell">
        {/* Analytics Overview */}
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
                        stepSize: 10, // Set y-axis interval to 10
                      },
                      beginAtZero: true, // Start y-axis at 0
                    },
                  },
                }}
              />
            )}
          </div>
        </section>

        {/* Recent Activities */}
        <section className="recent-activities">
          <h2>Recent Activities</h2>
          <ul>
            <li></li>
            <li></li>
          </ul>
        </section>

        {/* System Notifications */}
        <section className="system-notifications">
          <h2>System Notifications</h2>
          <ul>
            <li></li>
            <li></li>
          </ul>
        </section>
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