const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user, expiresIn = "1d") => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
