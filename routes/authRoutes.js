const express = require("express");
const bcrypt = require("bcryptjs");
const {generateToken} = require("../utils/jwt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const authRouter = express.Router();

authRouter.post("/signup", [body("username").notEmpty().withMessage("Username is required").isAlphanumeric().withMessage("Username must only contain letters and numbers"), body("password").isLength({min: 8, max: 20}).withMessage("Password must be between 8 and 20 characters long.")], async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      const existingUser = await prisma.user.findUnique({
          where: { username },
      });
      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
          data: {
              username,
              password: hashedPassword,
              role: "user",
          },
      });
      res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, username: user.username });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = authRouter;