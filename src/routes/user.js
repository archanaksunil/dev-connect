const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connection");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName about age gender photoUrl skills";

userRouter.get("/user/request", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    let data = requests.map((req) => {
      const user = req.fromUserId.toObject();
      user._id = req._id;
      return user;
    });
    res.json({ message: "Got Request received successfully", data });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connections.map((connection) => {
      if (user._id.toString() === connection.fromUserId._id.toString())
        return connection.toUserId;
      return connection.fromUserId;
    });
    res.json({ message: "Got connection", data });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;
    const connection = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    });
    const hideUser = new Set();
    connection.forEach((c) => {
      hideUser.add(c.fromUserId.toString());
      hideUser.add(c.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUser) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .limit(limit)
      .skip(skip);
    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = userRouter;
