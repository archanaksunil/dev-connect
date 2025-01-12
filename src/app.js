const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", (req, res) => {
  const newUser = new User({
    firstName: "lady",
    lastName: "kiki",
    email: "angelLady@gmail.com",
    age: 3,
    gender: "female",
  });
  try {
    newUser.save();
    res.send("User saved");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDb()
  .then(() => {
    console.log("successfully established connection");
    app.listen(7777, () => {
      console.log("listening");
    });
  })
  .catch((err) => {
    console.error(err);
  });
