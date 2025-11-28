const User = require("../models/User");
const createToken = require("../utils/jwt");

// Google OAuth Success Callback
const googleAuthSuccess = async (req, res) => {
  try {
    // User is attached to req.user by passport
    const user = req.user;

    // Create JWT token
    const token = createToken(user._id);
    res.setHeader("Authorization", `Bearer ${token}`);

    // Redirect to frontend with token or send JSON response
    res.status(200).json({
      message: "Google authentication successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("GOOGLE AUTH SUCCESS ERROR:", err);
    res.status(500).json({ error: "Authentication processing failed" });
  }
};

// Google OAuth Failure Callback
const googleAuthFailure = (req, res) => {
  res.status(401).json({ error: "Google authentication failed" });
};

module.exports = {
  googleAuthSuccess,
  googleAuthFailure,
};
