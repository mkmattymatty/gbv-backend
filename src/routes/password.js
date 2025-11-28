const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

// Forgot password (send email)
router.post("/forgot", forgotPassword);

// Reset password (from email link)
router.post("/reset/:token", resetPassword);

module.exports = router;
