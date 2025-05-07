import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/addtip.css';

const AddStudyTip = () => {
  const [formData, setFormData] = useState({
    category: '',
    level: '',
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });

  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'Subject Oriented', label: 'Subject Oriented' },
    { value: 'Study Skills', label: 'Study Skills' },
    { value: 'Exam Strategies', label: 'Exam Strategies' }
  ];

  const levels = [
    { value: '', label: 'Select a level' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = `${name === 'category' ? 'Category' : name === 'level' ? 'Level' : name === 'title' ? 'Title' : 'Description'} is required.`;
    } else if (name === 'title' && value.length < 5) {
      error = 'Title must be at least 5 characters long.';
    } else if (name === 'description' && value.length < 10) {
      error = 'Description must be at least 10 characters long.';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showNotification('Please fix the errors in the form.', 'error');
      return;
    }

    try {
      const response = await axios.post('/api/v1/study-tips/', formData);
      showNotification('Study tip added successfully!', 'success');
      setFormData({ category: '', level: '', title: '', description: '' });
      setErrors({});
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add study tip. Please try again.';
      showNotification(message, 'error');
    }
  };

  return (
    <div className="add-tip-container">
      <div className="add-tip-content">
        <h1>Add a New Study Tip</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'invalid' : ''}
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="error-message">{errors.category}</p>}
          </div>
          <div className="form-field">
            <label>Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={errors.level ? 'invalid' : ''}
            >
              {levels.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.level && <p className="error-message">{errors.level}</p>}
          </div>
          <div className="form-field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the tip title"
              className={errors.title ? 'invalid' : ''}
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          <div className="form-field">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter the tip description"
              className={errors.description ? 'invalid' : ''}
            />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </div>
          <button type="submit" className="submit-button">
            Add Study Tip
          </button>
        </form>
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' && <span className="notification-icon">✅ </span>}
            {notification.type === 'error' && <span className="notification-icon">❌ </span>}
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudyTip;