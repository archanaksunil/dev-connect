const User = require("../models/user");
const json = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("Please login");
      return;
    }
    const { _id } = await json.verify(token, process.env.JWT_SECRET);
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
