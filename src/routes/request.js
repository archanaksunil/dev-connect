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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const user = req.user;
      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status))
        throw new Error("Status is invalid");
      const connection = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });
      if (!connection) throw new Error("Connection request not found");
      connection.status = status;
      const data = await connection.save();
      res.json({ message: `Connection request ${status}`, data });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
);

module.exports = requestRouter;
