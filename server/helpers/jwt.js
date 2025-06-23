const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const options = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, JWT_ACCESS_SECRET, options);
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
