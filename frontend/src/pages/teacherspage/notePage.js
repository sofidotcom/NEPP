import React, { useState } from 'react';
import axios from 'axios';
import '../../css/noteadd.css'

const UploadNoteForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/notes', {
        title,
        description,
        subject,
        chapter,
      });
      setMessage('Note created successfully!');
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Chapter:</label>
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Note</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadNoteForm;