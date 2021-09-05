// importing user context
const { register, login } = require("../controllers/auth");
const express = require("express");
const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

module.exports = router;