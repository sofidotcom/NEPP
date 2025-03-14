import React, { useState } from 'react';
import './CourseForm.css';

const CourseForm = () => {
  const [unitNumber, setUnitNumber] = useState('');
  const [unitTopic, setUnitTopic] = useState('');
  const [contents, setContents] = useState([
    { contentNumber: '', contentTitle: '', contentBody: '' },
  ]);

  const handleAddContent = () => {
    setContents([...contents, { contentNumber: '', contentTitle: '', contentBody: '' }]);
  };

  const handleContentChange = (index, field, value) => {
    const updatedContents = contents.map((content, i) =>
      i === index ? { ...content, [field]: value } : content
    );
    setContents(updatedContents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = {
      unitNumber,
      unitTopic,
      contents,
    };
    console.log(courseData);
    alert('Course Added Successfully');
  };

  return (
    <div className="course-form-container">
      <h2>Add New Course Unit</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Unit Number</label>
          <input
            type="number"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Unit Topic</label>
          <input
            type="text"
            value={unitTopic}
            onChange={(e) => setUnitTopic(e.target.value)}
            required
          />
        </div>

        <h3>Course Contents</h3>
        {contents.map((content, index) => (
          <div key={index} className="content-group">
            <div className="form-group">
              <label>Content Number</label>
              <input
                type="text"
                value={content.contentNumber}
                onChange={(e) => handleContentChange(index, 'contentNumber', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Content Title</label>
              <input
                type="text"
                value={content.contentTitle}
                onChange={(e) => handleContentChange(index, 'contentTitle', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={content.contentBody}
                onChange={(e) => handleContentChange(index, 'contentBody', e.target.value)}
                required
              />
            </div>
          </div>
        ))}

        <button type="button" className="add-content-btn" onClick={handleAddContent}>
          + Add More Content
        </button>

        <button type="submit" className="submit-btn">Submit Course</button>
      </form>
    </div>
  );
};

export default CourseForm;
