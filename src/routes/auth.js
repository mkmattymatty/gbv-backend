const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const userController = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

module.exports = router;
