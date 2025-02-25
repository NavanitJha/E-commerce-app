// tests/testDB.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer; // MongoDB Memory Server
let server; // Your Express server

// Connect to in-memory MongoDB database for testing
const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '6.0.5', // Set your MongoDB version
      // version: "5.0.21", // Use a supported MongoDB version
    },
  });
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("MongoDB Memory Server connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
};



// Close MongoDB and server properly
const closeTestDB = async () => {
  console.log("Closing test DB...");
  
  // Close the mongoose connection and drop the test database
  // await mongoose.connection.dropDatabase();
  // await mongoose.connection.close();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  
  // Stop the MongoDB memory server
  if (mongoServer) {
    await mongoServer.stop();
  }
  
  // Close the Express server (if using one)
  if (server) {
    server.close(() => {
      console.log("Server closed.");
    });
  }
};

module.exports = { connectTestDB, closeTestDB };
