import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useParams, Outlet } from 'react-router-dom';
import SidebarR from './studentSideBar';
import '../../css/entranceLayout.css';


 // Import CSS for layout

const StudentPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout'); // Redirect to the logout page
  };

  const { id } = useParams(); // Extract the `id` parameter from the URL
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError('Student ID is missing');
        return;
      }

      try {
        const response = await axios.get(`/api/v1/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        setError('Error fetching student data');
      }
    };

    fetchStudentData();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!student) return <div className="loading">Loading...</div>;

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className="sidebar-container">
        <SidebarR student={student} /> {/* Pass student data as props */}
      </div>

      {/* Main Content */}
      <div className="main-content-container">
        <Outlet context={student}/> {/* Render child components (e.g., exams, courses) */}
      </div>
    <div className='userprofile'>
      <h3>Profile</h3>
        <p>Name: {student.name}</p>
        <p>Phone: {student.phoneNumber}</p>
        {/* <button className="logout-button" onClick={handleLogout}>logout</button> */}
        
      </div>
    </div>
  );
};

export default StudentPage;
