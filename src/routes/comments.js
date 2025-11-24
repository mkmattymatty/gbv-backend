// backend/src/routes/comments.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const auth = require("../middleware/auth"); // existing middleware

const router = express.Router();

// Get all comments (sorted oldest -> newest)
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error("Failed to load comments:", err);
    res.status(500).json({ error: "Failed to load comments" });
  }
});

// Post a new comment (requires auth)
router.post(
  "/",
  auth,
  body("text").isString().trim().isLength({ min: 3, max: 5000 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text } = req.body;
      // If you store username on the User model, you can fetch it. For now, try token-decoded userId.
      let username = "Anonymous";
      if (req.userId) {
        // Attempt to read username quickly without requiring controller import:
        // This is optional — if you want username, you can populate in a later iteration.
        // For now we set username to the id's string for traceability.
        username = req.username || req.userId.toString();
      }

      const comment = new Comment({
        userId: req.userId || null,
        username,
        text
      });

      await comment.save();
      res.status(201).json(comment);
    } catch (err) {
      console.error("Failed to save comment:", err);
      res.status(500).json({ error: "Failed to save comment" });
    }
  }
);

module.exports = router;
