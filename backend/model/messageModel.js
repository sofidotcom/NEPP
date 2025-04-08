const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    sender: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "sender.userModel",
        required: true,
      },
      userModel: {
        type: String,
          enum: ["students", "Teachers"], // Changed from "Teacher" to "Teachers"
        required: true,
      },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isModerated: {
      type: Boolean,
      default: false,
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teachers", // Changed from "Teacher" to "Teachers"
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Message", messageSchema)



