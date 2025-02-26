// tests/authMiddleware.test.js

const authMiddleware = require("../src/middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const mockingoose = require("mockingoose");
const User = require("../src/models/userModel");

jest.mock("jsonwebtoken");

describe("Auth Middleware Test Cases", () => {
  
  it("should return 401 if no token is provided", () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, no token" });
  });

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

  it("should call next() if token is valid and user is found", async () => {
    const req = { headers: { authorization: "Bearer valid_token" } };
    const res = {};
    const next = jest.fn();

    const decodedToken = { id: "123" };
    jwt.verify.mockReturnValue(decodedToken);

    mockingoose(User).toReturn({ _id: "123", name: "Test User" }, "findOne");

    await authMiddleware(req, res, next);

    expect(req.user).toHaveProperty("name", "Test User");
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if user is not found", async () => {
    const req = { headers: { authorization: "Bearer valid_token" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const decodedToken = { id: "123" };
    jwt.verify.mockReturnValue(decodedToken);

    mockingoose(User).toReturn(null, "findOne");

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, user not found" });
  });
});
