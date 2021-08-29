require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const auth = require("./middleware/auth");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

app.post('/welcome', auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

module.exports = app;