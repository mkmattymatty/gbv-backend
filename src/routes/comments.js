const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const requireAuth = require("../middleware/requireAuth");

// GET all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: 1 });

    res.json(
      comments.map((c) => ({
        _id: c._id,
        text: c.text,
        username: c.username,
        userId: c.userId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
    );
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST new comment
router.post("/", requireAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ error: "Comment too short." });
    }

    const username = req.user.username || req.user.email || "Anonymous";

    const comment = await Comment.create({
      text,
      username,
      userId: req.user._id,
    });

    res.status(201).json({
      _id: comment._id,
      text: comment.text,
      username: comment.username,
      userId: comment.userId,
      createdAt: comment.createdAt,
    });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save comment" });
  }
});

// DELETE a comment
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized." });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// EDIT comment
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ error: "Comment too short." });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized." });
    }

    comment.text = text.trim();
    await comment.save();

    res.json({
      _id: comment._id,
      text: comment.text,
      username: comment.username,
      userId: comment.userId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ error: "Failed to edit comment" });
  }
});

module.exports = router;
