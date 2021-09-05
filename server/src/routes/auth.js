// importing user context
const { register, login, verifyToken } = require("../controllers/auth");
const express = require("express");
const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

router.post('/verifyToken', verifyToken, (req, res) => {
  res.status(200).send("Token verified");
});

module.exports = router;