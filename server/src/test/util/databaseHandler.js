const mongoose = require("mongoose");
const { connect } = require("mongoose");

const dotenv = require('dotenv');
dotenv.config();

const { MONGO_URI_TEST } = process.env;

/**
 * Connect the test database
 */
const connectDatabase = async () => {
  connect(MONGO_URI_TEST)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

/**
 * Delete db collections
 */
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Close db connection
 */
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports = { connectDatabase, clearDatabase, closeDatabase };