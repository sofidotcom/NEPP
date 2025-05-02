import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../../css/noteadd.css';

const UploadNoteForm = ({ initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '9',
    chapter: '',
    _id: null
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
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        subject: initialData.subject || '',
        grade: initialData.grade || '9',
        chapter: initialData.chapter || '',
        _id: initialData._id || null
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (formData._id) {
        // Update existing note
        const response = await axios.put(`/api/v1/notes/${formData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessage('Note updated successfully!');
      } else {
        // Create new note
        const response = await axios.post('/api/v1/notes', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessage('Note created successfully!');
      }

      // Clear form except subject
      setFormData(prev => ({
        title: '',
        description: '',
        subject: prev.subject,
        grade: '9',
        chapter: '',
        _id: null
      }));
    } catch (error) {
      setMessage(formData._id ? 'Error updating note' : 'Error creating note');
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
        <button type="submit">{formData._id ? 'Update Note' : 'Add Note'}</button>
      </form>
      {message && (
        <p className={message.includes('success') ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadNoteForm;
