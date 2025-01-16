const User = require("../models/user");
const json = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token");
    const { _id } = await json.verify(token, "devConnectSecret");
    if (!_id) throw new Error("token expired");
    const user = await User.findById(_id);
    if(!user) throw new Error("user doesn't exist");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error " + err)
  }
};

module.exports = { userAuth };
