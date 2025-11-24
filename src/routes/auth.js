const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// ========================
// REGISTER
// ========================
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('username').trim().notEmpty()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, username, emergencyContact } = req.body;

    // Check if email already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = new User({ email, password, username, emergencyContact });
    await user.save();

    // Return success (NO TOKEN)
    return res.status(201).json({
      message: "Account created successfully. Please log in."
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ========================
// LOGIN
// ========================
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Lookup user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Respond
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
