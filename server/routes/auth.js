// importing user context
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
      return;
    }

    // Check if user exists in our database
    const alreadyExistentUser = await User.findOne({ email });

    if (alreadyExistentUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword
    });

    // Create and save user token
    user.token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h"
      }
    );

    // Return a new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    // Check if user exists in our database
    const alreadyExistentUser = await User.findOne({ email });

    if (alreadyExistentUser && (await bcrypt.compare(password, alreadyExistentUser.password))) {
      // Create and save user token
      alreadyExistentUser.token = jwt.sign(
        { user_id: alreadyExistentUser._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h"
        }
      );

      // Return the user found
      res.status(200).json(alreadyExistentUser);
      return;
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;