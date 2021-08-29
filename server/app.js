require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const { verifyToken } = require("./controllers/auth");
const authRoute = require("./routes/auth");

const app = express();

app.use(express.json());

app.use('/auth', authRoute);

app.post('/welcome', verifyToken, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

module.exports = app;