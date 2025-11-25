// backend/src/models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  username: { type: String, default: "Anonymous" }, // store logged-in username if sent
  text: { type: String, required: true, maxlength: 5000 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
