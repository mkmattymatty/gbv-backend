const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 5000,
      trim: true,
    },
  },
  { timestamps: true } // <-- ensures createdAt & updatedAt ALWAYS exist
);

module.exports = mongoose.model("Comment", commentSchema);
