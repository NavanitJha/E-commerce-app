const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../src/utils/tokenUtils");

jest.mock("jsonwebtoken");

describe("Token Utilities", () => {
    const mockUser = { _id: "1234567890", role: "user" };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should generate a JWT token", () => {
        jwt.sign.mockReturnValue("mockToken123");

        const token = generateToken(mockUser);

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser._id, role: mockUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        expect(token).toBe("mockToken123");
    });

    it("should generate a JWT token with custom expiration", () => {
        jwt.sign.mockReturnValue("customExpToken");

        const token = generateToken(mockUser, "2h");

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser._id, role: mockUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        expect(token).toBe("customExpToken");
    });

    it("should verify a valid JWT token", () => {
        jwt.verify.mockReturnValue({ id: mockUser._id, role: mockUser.role });

        const decoded = verifyToken("validToken");

        expect(jwt.verify).toHaveBeenCalledWith("validToken", process.env.JWT_SECRET);
        expect(decoded).toEqual({ id: mockUser._id, role: mockUser.role });
    });

    it("should throw an error for an invalid JWT token", () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid token");
        });

        expect(() => verifyToken("invalidToken")).toThrow("Invalid token");
        expect(jwt.verify).toHaveBeenCalledWith("invalidToken", process.env.JWT_SECRET);
    });

    it("should throw an error for an expired JWT token", () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("jwt expired");
        });

        expect(() => verifyToken("expiredToken")).toThrow("jwt expired");
        expect(jwt.verify).toHaveBeenCalledWith("expiredToken", process.env.JWT_SECRET);
    });
});
