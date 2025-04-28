import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/studentDisplay.css';

const StudentDisplay = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateData, setUpdateData] = useState({ id: '', password: '' });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/v1/signup/');
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
      await axios.delete(`/api/v1/signup/${id}`);
      setStudents(students.filter(student => student._id !== id));
    } catch (err) {
      setError('Failed to delete student');
      console.error('Error deleting student:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/signup/${updateData.id}`, {
        password: updateData.password
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

  if (loading) return <div className="loading-container">Loading students...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="student-display-container">
      <div className="header-section">
        <h1>Student Management</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="students-table">
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
      </div>

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
  );
};

export default StudentDisplay;