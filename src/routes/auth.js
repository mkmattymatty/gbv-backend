const express = require("express");
const userController = require("../controllers/userControllers");
const passport = require("passport");
const {
  googleAuthSuccess,
  googleAuthFailure,
} = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/register", userController.registerUser);

// Login route
router.post("/login", userController.loginUser);

// Logout route
router.post("/logout", userController.logoutUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleAuthSuccess
);

router.get("/google/failure", googleAuthFailure);

module.exports = router;
