import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../css/teacherManagment.css';

const TeacherDisplay = () => {
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
      const res = await axios.get("/api/v1/teacher/");
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
        await axios.delete(`/api/v1/teacher/${id}`);
        setTeachers(teachers.filter((teacher) => teacher._id !== id));
      } catch (error) {
        setError(error.response?.data?.message || "Error deleting teacher");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/v1/teacher/${updateData.id}`, {
        password: updateData.password,
        subject: updateData.subject,
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
    <div className="management-container">
      <div className="header-section">
        <h2>Teacher Management</h2>
        <div className="search-add-container">
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => navigate('/admin/teacher/add')}
            className="add-button"
          >
            Add New Teacher
          </button>
        </div>
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
  );
};

export default TeacherDisplay;