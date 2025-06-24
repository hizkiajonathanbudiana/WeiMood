const verifyToken = require("../helpers/jwt");
const { User } = require("../models");

// <-- PERBAIKAN: Fungsi harus 'async' untuk menggunakan 'await'
const protectorLogin = async (req, res, next) => {
  try {
    // Membaca cookie dengan nama yang benar ("accessToken")
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, please login" });
    }
    const decoded = verifyToken.verifyToken(token);

    // <-- PERBAIKAN: Wajib gunakan 'await' karena findOne adalah operasi database
    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Menyimpan data user yang relevan ke req.user
    req.user = {
      id: user.id,
      email: user.email,
    };
    next();
  } catch (error) {
    // Menangani token yang tidak valid atau error lainnya
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Protector Error:", error); // Log error untuk debugging
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  protectorLogin,
};
