require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const { verifyToken } = require("./controllers/auth");
const authRoute = require("./routes/auth");
const path = require("path");

const app = express();
app.disable("x-powered-by");

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(express.json());

app.use('/auth', authRoute);

app.post('/welcome', verifyToken, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

module.exports = app;