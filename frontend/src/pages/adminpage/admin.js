import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/admin.css";
import { Link } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

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

  // Fetch student count
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const res = await axios.get("/api/v1/signup/count");
        const data = res.data;
        if (data.success) {
          setStudentCount(data.count);
        } else {
          throw new Error("Failed to fetch student count");
        }
      } catch (err) {
        setStudentCountError(err.message);
      } finally {
        setStudentCountLoading(false);
      }
    };

    fetchStudentCount();
  }, []);

  // Fetch teacher count
  useEffect(() => {
    const fetchTeacherCount = async () => {
      try {
        const res = await axios.get("/api/v1/teacher/count");
        const data = res.data;
        if (data.success) {
          setTeacherCount(data.count);
        } else {
          throw new Error("Failed to fetch teacher count");
        }
      } catch (err) {
        setTeacherCountError(err.message);
      } finally {
        setTeacherCountLoading(false);
      }
    };

    fetchTeacherCount();
  }, []);

  // Fetch chat room count
  useEffect(() => {
    const fetchChatRoomCount = async () => {
      try {
        const res = await axios.get("/api/v1/chat/count");
        const data = res.data;
        if (data.success) {
          setChatRoomCount(data.count);
        } else {
          throw new Error("Failed to fetch chat room count");
        }
      } catch (err) {
        setChatRoomCountError(err.message);
      } finally {
        setChatRoomCountLoading(false);
      }
    };

    fetchChatRoomCount();
  }, []);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get("https://your-api-endpoint.com/chartData");
        const data = res.data;

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Total Users",
              data: data.values,
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch chart data", err);
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
            onClick={() => handleSidebarClick("Question  management")}
          >
            Question  management
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
              Total students: {studentCountLoading ? "Loading..." : studentCountError ? "Error" : studentCount}
            </div>
            <div className="card">Active students: 938</div>
            <div className="card">
              Total teachers: {teacherCountLoading ? "Loading..." : teacherCountError ? "Error" : teacherCount}
            </div>
            <div className="card">Total questions posted: 1000</div>
            <div className="card">Total tips: 8789</div>
            <div className="card">
              Total chatrooms: {chatRoomCountLoading ? "Loading..." : chatRoomCountError ? "Error" : chatRoomCount}
            </div>
          </div>
          <div className="analytics-chart">
            {/* <Line data={chartData.data} /> */}
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