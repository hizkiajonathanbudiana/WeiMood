const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes.js");
const moodRoutes = require("./moodRoutes");
const authRoutes = require("./authRoutes");

router.use("/users", userRoutes);
router.use("/moods", moodRoutes);
router.use("/auth", authRoutes);

module.exports = router;
