const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const ChatController = require("../controllers/chatController.js");
const { protectorLogin } = require("../middlewares/middlewares");

router.post("/login", userController.loginHandler);
router.post("/register", userController.registerHandler);
router.post("/google", userController.googleLogin);

router.use(protectorLogin);
router.get("/auth/me", (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
  });
});
router.post("/chat", ChatController.generateChat);

module.exports = router;
