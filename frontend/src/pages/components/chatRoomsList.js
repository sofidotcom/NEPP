"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../css/chatRoomList.css"

const ChatRoomsList = () => {
  const [chatRooms, setChatRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
  })

  // Get user role directly from localStorage
  const userRole = localStorage.getItem("userRole")
  const isTeacher = userRole === "teacher"

  // Log for debugging
  console.log("User Role from localStorage:", userRole)
  console.log("Is Teacher:", isTeacher)

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          setError("Authentication required. Please log in.")
          setLoading(false)
          return
        }

        const response = await axios.get("/api/v1/chat/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setChatRooms(response.data.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching chat rooms:", err)
        setError("Failed to load chat rooms. Please try again.")
        setLoading(false)
      }
    }

    fetchChatRooms()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await axios.post("/api/v1/chat/rooms", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Add new room to the list
      setChatRooms((prev) => [...prev, response.data.data])

      // Reset form
      setFormData({ name: "", subject: "", description: "" })
      setShowCreateForm(false)
      setLoading(false)
    } catch (err) {
      console.error("Error creating chat room:", err)
      setError("Failed to create chat room. Please try again.")
      setLoading(false)
    }
  }

  const handleJoinRoom = async (roomId) => {
    try {
      const token = localStorage.getItem("token")

      try {
        // Try to join the room
        await axios.post(
          `/api/v1/chat/rooms/${roomId}/join`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
      } catch (joinError) {
        // If error is not "already a participant", rethrow it
        if (
          !joinError.response ||
          joinError.response.status !== 400 ||
          !joinError.response.data.message.includes("already a participant")
        ) {
          throw joinError
        }
        // Otherwise, ignore the error - user is already a participant
        console.log("User is already a participant in this room")
      }

      // Navigate to the room regardless of whether join was needed
      window.location.href = `/chat-room/${roomId}`
    } catch (err) {
      console.error("Error joining chat room:", err)
      setError("Failed to join chat room. Please try again.")
    }
  }

  if (loading && chatRooms.length === 0) {
    return <div className="loading-container">Loading chat rooms...</div>
  }

  return (
    <div className="container rooms-container">
      <div className="header">
        <h1 className="page-title">Subject Chat Rooms</h1>
        {isTeacher && (
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-button">
            {showCreateForm ? "Cancel" : "Create New Room"}
          </button>
        )}
      </div>

      {error && <div className="error-alert">{error}</div>}

      {/* Debug info - remove in production */}
      <div style={{ background: "#f0f0f0", padding: "10px", marginBottom: "10px", fontSize: "12px" }}>
        <p>Debug Info (remove in production):</p>
        <p>User Role: {userRole}</p>
        <p>Is Teacher: {isTeacher ? "Yes" : "No"}</p>
        <p>Token exists: {localStorage.getItem("token") ? "Yes" : "No"}</p>
      </div>

      {/* Create Room Form for Teachers */}
      {showCreateForm && isTeacher && (
        <div className="form-container">
          <h2 className="form-title">Create New Chat Room</h2>
          <form onSubmit={handleCreateRoom}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Room Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows="3"
              />
            </div>
            <button type="submit" className="submit-button">
              Create Room
            </button>
          </form>
        </div>
      )}

      {/* Chat Rooms List */}
      <div className="rooms-grid">
        {chatRooms.length === 0 ? (
          <div className="empty-rooms">No chat rooms available. {isTeacher && "Create one to get started!"}</div>
        ) : (
          chatRooms.map((room) => (
            <div key={room._id} className="room-card">
              <div className="room-content">
                <h3 className="room-name">{room.name}</h3>
                <p className="room-subject">Subject: {room.subject}</p>
                {room.description && <p className="room-description">{room.description}</p>}
                <div className="room-date">Created: {new Date(room.createdAt).toLocaleDateString()}</div>
                <button onClick={() => handleJoinRoom(room._id)} className="join-button">
                  Join Chat
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatRoomsList





