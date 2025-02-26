// tests/db.test.js

const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

jest.mock("mongoose");

describe("Database Connection", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules(); 
        process.env = { ...originalEnv }; // Reset environment variables
    });

    afterEach(() => {
        process.env = originalEnv; // Restore environment
        jest.clearAllMocks();
    });

    it("should skip database connection when NODE_ENV is 'test'", async () => {
        process.env.NODE_ENV = "test";

        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
        await connectDB();

        expect(consoleLogSpy).toHaveBeenCalledWith("Skipping database connection in test mode.");
        expect(mongoose.connect).not.toHaveBeenCalled();

        consoleLogSpy.mockRestore();
    });

    it("should connect to MongoDB successfully", async () => {
        process.env.NODE_ENV = "development";
        process.env.MONGO_URI1 = "mongodb://localhost:27017/E-commercetestdb";

        mongoose.connect.mockResolvedValue({
            connection: { host: "localhost" },
        });

        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI1, {});
        expect(consoleLogSpy).toHaveBeenCalledWith("MongoDB Connected: localhost");

        consoleLogSpy.mockRestore();
    });

    it("should log an error and exit process when connection fails", async () => {
        process.env.NODE_ENV = "development";

        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

        mongoose.connect.mockRejectedValue(new Error("Connection failed"));

        await connectDB();

        expect(consoleErrorSpy).toHaveBeenCalledWith("MongoDB connection Error: Connection failed");
        expect(processExitSpy).toHaveBeenCalledWith(1);

        consoleErrorSpy.mockRestore();
        processExitSpy.mockRestore();
    });

    it("should log an error and exit process if MONGO_URI1 is not defined", async () => {
        process.env.NODE_ENV = "development";
        delete process.env.MONGO_URI1; 
    
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
    
        await connectDB();
    
        expect(consoleErrorSpy).toHaveBeenCalledWith("MONGO_URI is not defined. Check your .env file.");
        expect(processExitSpy).toHaveBeenCalledWith(1);
    
        consoleErrorSpy.mockRestore();
        processExitSpy.mockRestore();
    });
});
