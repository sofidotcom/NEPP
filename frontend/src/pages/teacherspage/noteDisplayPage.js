import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/notesBySubject.css'; // Import the CSS file for styling
import SidebarR from '../studentspage/studentSideBar';

const NotesBySubject = () => {
    const { subject } = useParams(); // Get the subject from the URL
    const [notes, setNotes] = useState([]); // State to store notes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    // Fetch notes based on the subject
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`/api/v1/notes?subject=${subject}`);
                setNotes(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notes:', error.message);
                setError('Failed to fetch notes. Please try again later.');
                setLoading(false);
            }
        };

        fetchNotes();
    }, [subject]);

    // Filter notes based on search query
    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <>
        <SidebarR />
        <div className="notes-container">
            {/* Sticky Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* <h2>Notes for {subject}</h2> */}
            </div>

            
            {filteredNotes.length === 0 ? (
                <p className="no-notes">No notes found for this subject.</p>
            ) : (
                <div className="notes-list">
                    {filteredNotes.map((note) => (
                        <div className="note-card" key={note._id}>
                            <h3 className="note-title">#{note.title}</h3>
                            <p className="note-description">{note.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
};

export default NotesBySubject;