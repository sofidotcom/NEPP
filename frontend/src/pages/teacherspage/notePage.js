import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../../css/noteadd.css';

const UploadNoteForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '9',
    chapter: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setFormData(prev => ({
          ...prev,
          subject: decodedToken.subject || ''
        }));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/notes', formData);
      setMessage('Note created successfully!');
      
      // Clear form fields after successful submission, keeping subject
      setFormData(prev => ({
        title: '',
        description: '',
        subject: prev.subject,
        grade: '9',
        chapter: ''
      }));
      
      console.log(response.data);
    } catch (error) {
      setMessage('Error creating note');
      console.error(error);
    }
  };

  return (
    <div className="upload-note-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            disabled
            required
          />
        </div>
        <div>
          <label>Grade:</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          >
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>
        <div>
          <label>Chapter:</label>
          <input
            type="text"
            name="chapter"
            value={formData.chapter}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Note</button>
      </form>
      {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
    </div>
  );
};

export default UploadNoteForm;