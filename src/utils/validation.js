const validator = require("validator");
const User = require("../models/user");
const ConnectionRequest = require("../models/connection");

const validateUser = (req) => {
  const { firstName, lastName, email, password } = req;
  if (!firstName || !lastName) throw new Error("Invalid Name");
  else if (!validator.isEmail(email)) throw new Error("Invalid Email");
  else if (!validator.isStrongPassword(password))
    throw new Error("Invalid Password");
};

const validateEditUser = (req) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];
  const isAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_FIELDS.includes(field)
  );
  return isAllowed;
};

const validateConnection = async (req) => {
  const { status, toUserId } = req.params;
  const fromUserId = req.user._id;

  const ALLOWED_STATUS = ["interested", "ignored"];
  if (!ALLOWED_STATUS.includes(status)) throw new Error("Invalid status");

  const toUser = await User.findById(toUserId);
  if (!toUser) throw new Error("User not present");

  const findExisting = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (findExisting) throw new Error("Connection Request already exists");

  //   if(req.user._id === req.params.toUserId) throw new Error("Can't send connection request to yourself")
};

module.exports = { validateUser, validateEditUser, validateConnection };
