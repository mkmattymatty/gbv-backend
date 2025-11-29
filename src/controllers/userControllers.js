const createToken = require("../utils/jwt");
const User = require("../models/User");

// Controler for the register user
const registerUser = async (req, res, next) => {
  try {
    const { email, password, username, emergencyContact } = req.body;

    // Validate inputs
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email, password, and username are required" });
    }

    // Check if email already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create user
    const user = new User({ email, password, username, emergencyContact });
    await user.save();

    // create token after sucessful registration for easy login
    const token = createToken(user._id);
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(201).json({
      message: "Account created successfully. Please log in.",
      token,
    });
  } catch (err) {
    next(err);
  }
};

// Controller for the user login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.login(email, password);

    // create token and set it into the header for easy login
    const token = createToken(user._id);
    res.setHeader("Authorization", `Bearer ${token}`);

    // Respond
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Controller for user logout
const logoutUser = (req, res, next) => {
  try {
    // Clear the Authorization header
    res.removeHeader("Authorization");

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
