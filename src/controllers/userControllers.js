const createToken = require("../utils/jwt");
const User = require("../models/User");
// Controler for the register user
const registerUser = async (req, res) => {
  try {
    const { email, password, username, emergencyContact } = req.body;

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
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Controller for the user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
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
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Controller for user logout
const logoutUser = (req, res) => {
  try {
    // Clear the Authorization header
    res.removeHeader("Authorization");

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
