const { User } = require("../models");
const { hashPassword, comparePasswords } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

class userController {
  static async googleLogin(req, res) {
    console.log("REQUEST BODY DITERIMA DI BACKEND:", req.body);
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload.email;
      const googleSub = payload.sub;

      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          email,
          googleSub,
          provider: "google",
          password: null,
        });
      } else if (!user.googleSub) {
        user.googleSub = googleSub;
        user.provider = "google";
        await user.save();
      }
      const jwtToken = generateToken({ id: user.id });

      res.cookie("accessToken", jwtToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ token: jwtToken, access_token: jwtToken });
    } catch (error) {
      console.error("Error logging in with Google:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async registerHandler(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "email and password are required" });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "email already exists" });
      }
      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({ email, password: hashedPassword });
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async loginHandler(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "email and password are required" });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isValidPassword = await comparePasswords(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const jwtToken = generateToken({ id: user.id });

      res.cookie("accessToken", jwtToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ token: jwtToken, access_token: jwtToken });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await this.userService.updateUser(
        userId,
        updatedData
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = userController;
