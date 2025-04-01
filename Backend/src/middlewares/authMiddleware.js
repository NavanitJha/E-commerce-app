const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization); // Debug log

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log("Extracted Token:", token); // Debug log
  
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debug log

    req.user = await User.findById(decoded.id).select("-password");
    console.log("User Found:", req.user); // Debug log

    if (!req.user) return res.status(401).json({ message: "Not authorized, user not found" });
    next();

  } catch (error) {
    console.log("JWT Error:", error.message); // Debug log
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = authMiddleware; 