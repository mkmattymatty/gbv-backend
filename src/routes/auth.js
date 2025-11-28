const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const userController = require("../controllers/userControllers");

const router = express.Router();

// ========================
// REGISTER
// ========================
router.post("/register", userController.registerUser);

// ========================
// LOGIN
// ========================
router.post("/login", userController.loginUser);

module.exports = router;
