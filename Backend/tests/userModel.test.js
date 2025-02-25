const mockingoose = require("mockingoose");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/userModel");

jest.mock("bcryptjs");

describe("User Model", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        mockingoose(User); // Mock the User model globally
    });

    it("should create and save a user successfully", async () => {
        mockingoose(User).toReturn(
            {
                _id: new mongoose.Types.ObjectId(),
                name: "John Doe",
                email: "john@example.com",
                password: "hashedPassword123",
            },
            "save"
        );

        const user = new User({ name: "John Doe", email: "john@example.com", password: "password123" });
        const savedUser = await user.save();

        expect(savedUser).toHaveProperty("_id");
        expect(savedUser.name).toBe("John Doe");
        expect(savedUser.password).toBe("hashedPassword123");
    });

    it("should hash the password before saving when modified", async () => {
        bcrypt.hash.mockResolvedValue("hashedPassword123");

        const mockUser = new User({
            name: "Test User",
            email: "test@example.com",
            password: "plainPassword123",
        });

        mockUser.isModified = jest.fn().mockReturnValue(true);

        await mockUser.save(); // Ensure middleware executes

        expect(mockUser.isModified).toHaveBeenCalledWith("password");
        expect(bcrypt.hash).toHaveBeenCalledWith("plainPassword123", 10);
        expect(mockUser.password).toBe("hashedPassword123"); // Ensure password is hashed
    });

    it("should NOT hash the password if it is not modified", async () => {
        bcrypt.hash.mockResolvedValue("thisShouldNotBeCalled"); // Ensure hashing isn't called
    
        const mockUser = new User({
            name: "Test User",
            email: "test@example.com",
            password: "alreadyHashedPassword123",
        });
    
        mockUser.isModified = jest.fn().mockReturnValue(false); // Simulate password not modified
    
        await mockUser.save(); // Trigger the Mongoose pre-save hook
    
        expect(mockUser.isModified).toHaveBeenCalledWith("password");
        expect(bcrypt.hash).not.toHaveBeenCalled(); // bcrypt.hash should NOT be called
    });
    

    it("should compare passwords correctly", async () => {
        bcrypt.compare.mockResolvedValue(true);

        const mockUser = new User({
            name: "Test User",
            email: "test@example.com",
            password: "hashedPassword123",
        });

        const isMatch = await mockUser.comparePassword("plainPassword123");

        expect(bcrypt.compare).toHaveBeenCalledWith("plainPassword123", "hashedPassword123");
        expect(isMatch).toBe(true); 
    });

    it("should return false if passwords do not match", async () => {
        bcrypt.compare.mockResolvedValue(false);

        const mockUser = new User({
            name: "Test User",
            email: "test@example.com",
            password: "hashedPassword123",
        });

        const isMatch = await mockUser.comparePassword("wrongPassword");

        expect(bcrypt.compare).toHaveBeenCalledWith("wrongPassword", "hashedPassword123");
        expect(isMatch).toBe(false); // Ensures false is returned when passwords don’t match
    });
});
