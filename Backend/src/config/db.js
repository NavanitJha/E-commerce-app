const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" }); 

const MONGO_URI1 = process.env.MONGO_URI1;

if (!MONGO_URI1) {
  console.error("MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI1, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
