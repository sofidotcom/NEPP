const Message = require("../model/messageModel")
const ChatRoom = require("../model/chatRoomModel")

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body
    const userId = req.user.userId
    const userModel = req.user.role === "teacher" ? "Teachers" : "students"  // Changed from "Teacher" to "Teachers"

    // Check if chat room exists
    const chatRoom = await ChatRoom.findById(roomId)
    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      })
    }

    // Check if user is a participant
    const isParticipant = chatRoom.participants.some((p) => p.userId.toString() === userId && p.userModel === userModel)

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You must join the chat room before sending messages",
      })
    }

    // Create and save the message
    const message = new Message({
      chatRoom: roomId,
      sender: {
        userId,
        userModel,
      },
      content,
    })

    await message.save()

    // Emit the message to connected clients via Socket.io
    // This will be handled by the socket.io implementation

    res.status(201).json({
      success: true,
      data: message,
    })
  } catch (error) {
    console.error("Send message error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    })
  }
}

// Get messages for a chat room
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params
    const { page = 1, limit = 50 } = req.query

    // Check if chat room exists
    const chatRoom = await ChatRoom.findById(roomId)
    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      })
    }

    // Pagination
    const skip = (page - 1) * limit

    // Get messages
    const messages = await Message.find({
      chatRoom: roomId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate({
        path: "sender.userId",
        select: "name role subject",
      })

    // Get total count for pagination
    const total = await Message.countDocuments({
      chatRoom: roomId,
      isDeleted: false,
    })

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      data: messages,
    })
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    })
  }
}

// Moderate a message (teachers only)
const moderateMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const teacherId = req.user.userId

    // Verify the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can moderate messages",
      })
    }

    const message = await Message.findById(messageId)
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    // Check if teacher is a moderator for this chat room
    const chatRoom = await ChatRoom.findById(message.chatRoom)
    if (!chatRoom.moderators.includes(teacherId)) {
      return res.status(403).json({
        success: false,
        message: "You are not a moderator for this chat room",
      })
    }

    // Update message
    message.isModerated = true
    message.moderatedBy = teacherId
    message.isDeleted = true // This effectively removes the message from view

    await message.save()

    res.status(200).json({
      success: true,
      message: "Message moderated successfully",
    })
  } catch (error) {
    console.error("Moderate message error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to moderate message",
      error: error.message,
    })
  }
}

// Make sure to export all functions
module.exports = {
  sendMessage,
  getMessages,
  moderateMessage,
}


