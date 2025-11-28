// backend/src/routes/comments.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const checkUser = require("../middleware/checkUser");
const requireAuth = require("../middleware/requireAuth");

// GET all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST new comment
router.post("/", requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const username = req.user.username || req.user.email || "Anonymous";

    const comment = new Comment({
      text,
      username,
      userId: req.user._id,
    });

    const saved = await comment.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save comment" });
  }
});

// DELETE a comment
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// PATCH to edit a comment
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ error: "Not authorized to edit this comment" });

    comment.text = text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to edit comment" });
  }
});

module.exports = router;
