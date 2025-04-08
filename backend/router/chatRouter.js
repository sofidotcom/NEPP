const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/authMiddleware")
const {
  createChatRoom,
  getAllChatRooms,
  getChatRoomById,
  joinChatRoom,
  addModerator,
} = require("../controller/chatRoomController")
const { sendMessage, getMessages, moderateMessage } = require("../controller/messageController")

// Chat room routes
router.post("/rooms", verifyToken, createChatRoom)
router.get("/rooms", verifyToken, getAllChatRooms)
router.get("/rooms/:roomId", verifyToken, getChatRoomById)
router.post("/rooms/:roomId/join", verifyToken, joinChatRoom)
router.post("/rooms/moderator", verifyToken, addModerator)

// Message routes
router.post("/messages", verifyToken, sendMessage)
router.get("/rooms/:roomId/messages", verifyToken, getMessages)
router.patch("/messages/:messageId/moderate", verifyToken, moderateMessage)

module.exports = router







