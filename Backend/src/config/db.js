const mongoose = require('mongoose');
require("dotenv").config();

const MONGO_URI1 = process.env.MONGO_URI1;

if (!MONGO_URI1 && process.env.NODE_ENV !== 'test') {
    console.error('MONGO_URI is not defined. Check your .env file.');
    process.exit(1);  // Exit only if NOT in test mode
}

const connectDB = async () => {
    if (process.env.NODE_ENV === 'test') {
        console.log('Skipping database connection in test mode.');
        return;  // Skip DB connection in tests
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
