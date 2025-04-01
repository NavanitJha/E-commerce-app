// src/config/db.js

const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
    if (process.env.NODE_ENV === 'test') {
        console.log('Skipping database connection in test mode.');
        return;  // Skip DB connection in tests
    }

    const MONGO_URI1 = process.env.MONGO_URI1;

    if (!MONGO_URI1) {
        console.error('MONGO_URI is not defined. Check your .env file.');
        process.exit(1);  
    }

    try {
        const conn = await mongoose.connect(MONGO_URI1, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`); 
    } catch (err) {
        console.error(`MongoDB connection Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
