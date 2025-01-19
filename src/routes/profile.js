const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditUser } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditUser(req)) throw new Error("Invalid Edit User");
    const loggedinUser = req.user;
    console.log(loggedinUser);
    Object.keys(req.body).forEach(
      (field) => (loggedinUser[field] = req.body[field])
    );
    await loggedinUser.save();
    res.json({
      message: `${loggedinUser.firstName} user updated`,
      data: loggedinUser,
    });
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password, oldPassword } = req.body;
    const user = req.user;
    //check if the old password matches before changing
    const oldPasswordHash = await bcrypt.hash(oldPassword, 10);
    if (oldPasswordHash !== user.password)
      throw new Error("Old Password isn't correct");
    if (!validator.isStrongPassword(password))
      throw new Error("Password should be strong");
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.send("Password changed successfully");
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

module.exports = profileRouter;
