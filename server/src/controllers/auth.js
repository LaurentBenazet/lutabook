const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    req.user = jwt.verify(token, TOKEN_KEY);
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
  return next();
};

const register = async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!email) {
      res.status(400).send("Email is required");
      return;
    }
    if (!password) {
      res.status(400).send("Password is required");
      return;
    }
    if (!first_name) {
      res.status(400).send("First name is required");
      return;
    }
    if (!last_name) {
      res.status(400).send("Last name is required");
      return;
    }

    // Check if user exists in our database
    const alreadyExistentUser = await User.findOne({ email });

    if (alreadyExistentUser) {
      return res.status(409).send("User already exists. Please login");
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
};

const login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!email) {
      res.status(400).send("Email is required");
      return;
    }
    if (!password) {
      res.status(400).send("Password is required");
      return;
    }

    // Check if user exists in our database
    const alreadyExistentUser = await User.findOne({ email });

    if (alreadyExistentUser) {
      if (await bcrypt.compare(password, alreadyExistentUser.password)) {
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
      }
      else {
        res.status(400).send("Invalid credentials");
      }
    }
    else {
      res.status(400).send("User doesn't exist");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { verifyToken, register, login };