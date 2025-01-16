const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateUser } = require("./utils/validation");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieparser());

app.post("/signup", async (req, res) => {
  try {
    validateUser(req.body);

    const { firstName, lastName, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("User saved");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) throw new Error("Invalid Email");
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid Credentials");
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      //create jwt token
      const token = jwt.sign({ _id: user._id }, "devConnectSecret");
      //send token using cookie
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
      res.send("logged in !!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.findOne({ email: userEmail });
    // const users = await User.find({email: userEmail});
    if (!users) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No user");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error");
  }
});

app.get("/userById", async (req, res) => {
  const id = req.body._id;
  try {
    const users = await User.findById(id);
    if (!users) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error");
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.userId;
  try {
    await User.findByIdAndDelete(id);
    res.send("User deleted");
  } catch (err) {
    res.status(400).send("Error");
  }
});

app.patch("/user/:id", async (req, res) => {
  const id = req.params?.id;
  const body = req.body;
  try {
    const ALLOWED = ["password", "about", "skills", "photoUrl"];
    const isAllowed = Object.keys(body).every((k) => ALLOWED.includes(k));
    if (!isAllowed) throw new Error("Update Not allowed");
    if (body.skills.length > 10)
      throw new Error("Skills can't be more  than 10");
    await User.findByIdAndUpdate(id, body, {
      returnDocument: "before",
      runValidators: true,
    });
    res.send("updated successfully");
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

app.patch("/userByEmail/:email", async (req, res) => {
  const userEmail = req.params?.email;
  console.log(userEmail);
  const body = req.body;
  try {
    await User.findOneAndUpdate({ email: userEmail }, body, {
      runValidators: true,
    });
    res.send("updated successfully");
  } catch (err) {
    res.status(400).send("Error " + err);
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
