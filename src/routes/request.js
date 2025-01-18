const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " send connection request");
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

module.exports = requestRouter;
