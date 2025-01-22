const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connection");
const { validateConnection } = require("../utils/validation");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      await validateConnection(req);
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await request.save();
      res.json({
        message: `${
          status === "interested"
            ? "Connection request sent!"
            : "Connection request ignored"
        }`,
        data,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
);

module.exports = requestRouter;
