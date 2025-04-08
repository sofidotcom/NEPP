const ChatRoom = require("../model/chatRoomModel")
const Teacher = require("../model/teacherRegisterModel")

// Update the createChatRoom function
const createChatRoom = async (req, res) => {
  try {
    const { name, subject, description } = req.body
    const teacherId = req.user.userId

    // Verify the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can create chat rooms",
      })
    }

    // Create the chat room
    const chatRoom = new ChatRoom({
      name,
      subject,
      description,
      createdBy: teacherId,
      moderators: [teacherId],
      participants: [
        {
          userId: teacherId,
          userModel: "Teachers", // Changed from "Teacher" to "Teachers"
        },
      ],
    })

    await chatRoom.save()

    res.status(201).json({
      success: true,
      data: chatRoom,
    })
  } catch (error) {
    console.error("Create chat room error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create chat room",
      error: error.message,
    })
  }
}

// Get all chat rooms
const getAllChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({ isActive: true })
      .populate("createdBy", "name subject")
      .select("name subject description createdAt")

    res.status(200).json({
      success: true,
      count: chatRooms.length,
      data: chatRooms,
    })
  } catch (error) {
    console.error("Get chat rooms error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat rooms",
      error: error.message,
    })
  }
}

// Get chat room by ID
const getChatRoomById = async (req, res) => {
  try {
    const { roomId } = req.params

    const chatRoom = await ChatRoom.findById(roomId)
      .populate("createdBy", "name subject")
      .populate("moderators", "name subject")

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      })
    }

    res.status(200).json({
      success: true,
      data: chatRoom,
    })
  } catch (error) {
    console.error("Get chat room error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat room",
      error: error.message,
    })
  }
}

// Join a chat room
const joinChatRoom = async (req, res) => {
  try {
    const { roomId } = req.params
    const userId = req.user.userId
   const userModel = req.user.role === "teacher" ? "Teachers" : "students"
    const chatRoom = await ChatRoom.findById(roomId)

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      })
    }

    // Check if user is already a participant
    const isParticipant = chatRoom.participants.some((p) => p.userId.toString() === userId && p.userModel === userModel)

    if (isParticipant) {
      // Instead of returning an error, just return success
      return res.status(200).json({
        success: true,
        message: "You are already a participant in this chat room",
      })
    }

    // Add user to participants
    chatRoom.participants.push({
      userId,
      userModel,
    })

    await chatRoom.save()

    res.status(200).json({
      success: true,
      message: "Successfully joined the chat room",
    })
  } catch (error) {
    console.error("Join chat room error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to join chat room",
      error: error.message,
    })
  }
}

// Add a moderator (teachers only)
const addModerator = async (req, res) => {
  try {
    const { roomId, teacherId } = req.body

    // Verify the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can add moderators",
      })
    }

    const chatRoom = await ChatRoom.findById(roomId)

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      })
    }

    // Verify the user is the creator or already a moderator
    if (chatRoom.createdBy.toString() !== req.user.userId && !chatRoom.moderators.includes(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to add moderators",
      })
    }

    // Verify the teacher exists
    const teacher = await Teacher.findById(teacherId)
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      })
    }

    // Check if teacher is already a moderator
    if (chatRoom.moderators.includes(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Teacher is already a moderator",
      })
    }

    // Add teacher to moderators
    chatRoom.moderators.push(teacherId)

    // Add teacher to participants if not already
    const isParticipant = chatRoom.participants.some(
      (p) => p.userId.toString() === teacherId && p.userModel === "Teachers", // Changed from "Teacher" to "Teachers"
    )

    if (!isParticipant) {
      chatRoom.participants.push({
        userId: teacherId,
        userModel: "Teachers", // Changed from "Teacher" to "Teachers"
      })
    }

    await chatRoom.save()

    res.status(200).json({
      success: true,
      message: "Moderator added successfully",
    })
  } catch (error) {
    console.error("Add moderator error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add moderator",
      error: error.message,
    })
  }
}

// Make sure to export all functions
module.exports = {
  createChatRoom,
  getAllChatRooms,
  getChatRoomById,
  joinChatRoom,
  addModerator,
}




