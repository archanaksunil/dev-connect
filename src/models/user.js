const moongose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new moongose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 7,
      maxLength: 50,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not strong password " + value);
        }
      },
    },
    age: {
      type: Number,
      trim: true,
      min: 10,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} not supported`
      }
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      default: "https://avatar.iran.liara.run/public/boy?username=Ash",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL " + value);
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = async function (passwordInput) {
  const isValid = await bcrypt.compare(passwordInput, this.password);
  return isValid;
};

userSchema.methods.createJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "devConnectSecret", {
    expiresIn: "7d",
  });
  return token;
};

module.exports = moongose.model("User", userSchema);
