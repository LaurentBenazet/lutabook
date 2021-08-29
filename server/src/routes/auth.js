// importing user context
const { register, login } = require("../controllers/auth");
const express = require("express");
const router = express.Router();

// Register
router.post("/register", (req, res) => {
  register(req, res).catch(console.error);
});

// Login
router.post("/login", (req, res) => {
  login(req, res).catch(console.error);
});

module.exports = router;