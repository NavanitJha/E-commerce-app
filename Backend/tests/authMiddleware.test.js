const authMiddleware = require("../src/middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const mockingoose = require("mockingoose");
const User = require("../src/models/userModel");

// Mocking jwt
jest.mock("jsonwebtoken");

describe("Auth Middleware Test Cases", () => {

  // Test when no token is provided in the header
  it("should return 401 if no token is provided", () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, no token" });
  });

  // Test when an invalid token is provided
  it("should return 401 for invalid token", () => {
    const req = { headers: { authorization: "Bearer invalid_token" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, invalid token" });
  });

  // Test when token is valid, user is found, and next is called
  it("should call next() if token is valid", async () => {
    const req = { headers: { authorization: "Bearer valid_token" } };
    const res = {};
    const next = jest.fn();

    const decodedToken = { id: "123" };
    jwt.verify.mockReturnValue(decodedToken);

    // Mock User.findOne() to return a user with the given id
    mockingoose(User).toReturn({ _id: "123", name: "Test User" }, "findOne");

    // Call the middleware
    await authMiddleware(req, res, next);

    // Check if user was set on req object and next() was called
    expect(req.user).toHaveProperty("name", "Test User");
    expect(next).toHaveBeenCalled();
  });

  // Test when user is not found in the database
  it("should return 401 if user is not found", async () => {
    const req = { headers: { authorization: "Bearer valid_token" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const decodedToken = { id: "123" };
    jwt.verify.mockReturnValue(decodedToken);

    // Mock User.findOne() to return null (user not found)
    mockingoose(User).toReturn(null, "findOne");

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, user not found" });
  });
});
