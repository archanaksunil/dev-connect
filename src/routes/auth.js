const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateUser } = require("../utils/validation");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateUser(req.body);

    const { firstName, lastName, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    const savedUser = await user.save();
    const token = await savedUser.createJwt();
    res.cookie("token", token);
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) throw new Error("Invalid Email");
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid Credentials");
    const isValid = await user.validatePassword(password);
    if (isValid) {
      const token = await user.createJwt();
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged out");
});

module.exports = authRouter;
