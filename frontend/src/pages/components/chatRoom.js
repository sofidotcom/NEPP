"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import io from "socket.io-client"
import axios from "axios"
import "../../css/chatRoom.css"


const ChatRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [roomInfo, setRoomInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [typingUsers, setTypingUsers] = useState([])
  const [totalMembers, setTotalMembers] = useState(0)
  const [activeMembers, setActiveMembers] = useState(0)

  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Get user info from local storage
  const userId = localStorage.getItem("userId")
  const userRole = localStorage.getItem("userRole")
  const token = localStorage.getItem("token")

  const isTeacher = userRole === "teacher"
  const [isModerator, setIsModerator] = useState(false)

  useEffect(() => {
    // Fetch room info and messages
    const fetchRoomData = async () => {
      try {
        setLoading(true)

        // Fetch room info
        const roomResponse = await axios.get(`/api/v1/chat/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setRoomInfo(roomResponse.data.data)

        // Set the total members count from participants array
        if (roomResponse.data.data.participants) {
          setTotalMembers(roomResponse.data.data.participants.length)
        }

        // Check if user is a moderator
        if (isTeacher && roomResponse.data.data.moderators.some((mod) => mod._id === userId)) {
          setIsModerator(true)
        }

        // Fetch messages
        const messagesResponse = await axios.get(`/api/v1/chat/rooms/${roomId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setMessages(messagesResponse.data.data.reverse())
        setLoading(false)
      } catch (err) {
        console.error("Error fetching room data:", err)
        setError("Failed to load chat room data. Please try again.")
        setLoading(false)
      }
    }

    fetchRoomData()

    // Initialize socket connection
    const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      auth: { token },
    })

    socketRef.current = socket

    // Socket event listeners
    socket.on("connect", () => {
      console.log("Socket connected")
      socket.emit("join_room", roomId)
    })

    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    socket.on("user_joined", (user) => {
      // You could show a notification that a user joined
      console.log(`User joined: ${user.userId}`)
      // Increment total members when someone joins
      setTotalMembers((prev) => prev + 1)
      // Update active members
      setActiveMembers((prev) => prev + 1)
    })

    socket.on("user_left", (user) => {
      // You could show a notification that a user left
      console.log(`User left: ${user.userId}`)
      // Update active members
      setActiveMembers((prev) => Math.max(0, prev - 1))
    })

    socket.on("user_typing", (user) => {
      setTypingUsers((prev) => {
        if (!prev.some((u) => u.userId === user.userId)) {
          return [...prev, user]
        }
        return prev
      })
    })

    socket.on("user_stop_typing", (user) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== user.userId))
    })

    socket.on("message_moderated", ({ messageId }) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId))
    })

    socket.on("error", (error) => {
      console.error("Socket error:", error)
      setError(error.message)
    })

    socket.on("active_users_count", (count) => {
      setActiveMembers(count)
    })

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_room", roomId)
        socketRef.current.disconnect()
      }
    }
  }, [roomId, token, userId, isTeacher])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // Emit message to socket
    socketRef.current.emit("send_message", {
      roomId,
      content: newMessage,
    })

    // Clear input
    setNewMessage("")

    // Clear typing indicator
    socketRef.current.emit("stop_typing", { roomId })
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)

    // Handle typing indicator
    if (e.target.value) {
      // Emit typing event
      socketRef.current.emit("typing", { roomId })

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("stop_typing", { roomId })
      }, 2000)
    } else {
      // If input is empty, stop typing
      socketRef.current.emit("stop_typing", { roomId })
    }
  }

  const handleModerateMessage = (messageId) => {
    if (window.confirm("Are you sure you want to moderate this message?")) {
      socketRef.current.emit("moderate_message", { messageId })
    }
  }

  if (loading) {
    return <div className="loading-container">Loading chat room...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="back-button" onClick={() => navigate("/chat-rooms")}>
          Back to Chat Rooms
        </button>
      </div>
    )
  }

  return (
    <div className="chat-container">
      {/* Chat Room Header */}
      <div className="chat-header">
        <div className="header-content">
          <div>
            <h2 className="room-title">{roomInfo?.name}</h2>
            <p className="room-subject">Subject: {roomInfo?.subject}</p>
          </div>
          <div className="members-info">
            <div className="member-count">
              <span className="count-icon">👥</span>
              <span className="count-number">{totalMembers}</span>
              <span className="count-label">members</span>
            </div>
            <div className="member-count active">
              <span className="count-icon">🟢</span>
              <span className="count-number">{activeMembers}</span>
              <span className="count-label">online</span>
            </div>
          </div>
          <button className="back-button" onClick={() => navigate("/chat-rooms")}>
            Back to Rooms
          </button>
        </div>
        {roomInfo?.description && <p className="room-description">{roomInfo.description}</p>}
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-messages">
            <img src="/images/empty-chat.gif" alt="Empty chat" className="empty-chat-gif" />
            <p>No messages yet. Be the first to send a message!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`message-wrapper ${message.sender.userId._id === userId ? "sent" : "received"}`}
            >
              <div className={`message-bubble ${message.sender.userId._id === userId ? "sent" : "received"}`}>
                <div className="sender-info">
                  <span className="sender-name">{message.sender.userId.name}</span>
                  {message.sender.userModel === "Teacher" && <span className="teacher-badge">Teacher</span>}
                </div>
                <p>{message.content}</p>
                <span className="message-time">{new Date(message.createdAt).toLocaleTimeString()}</span>

                {/* Moderation button for teachers who are moderators */}
                {isModerator && message.sender.userId._id !== userId && (
                  <button className="moderate-button" onClick={() => handleModerateMessage(message._id)}>
                    Moderate
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.length === 1
            ? `${typingUsers[0].role === "teacher" ? "Teacher" : "Someone"} is typing...`
            : `${typingUsers.length} people are typing...`}
        </div>
      )}

      {newMessage.trim() && (
        <div className="message-preview-container">
          <div className="message-preview-label">Preview:</div>
          <div className="message-wrapper sent">
            <div className="message-bubble sent message-preview">
              <div className="sender-info">
                <span className="sender-name">You</span>
                {isTeacher && <span className="teacher-badge">Teacher</span>}
              </div>
              <p>{newMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="message-form">
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="message-input"
          />
          <button type="submit" disabled={!newMessage.trim()} className="send-button">
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatRoom











