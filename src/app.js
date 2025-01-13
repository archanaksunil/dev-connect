const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User saved");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const users = await User.findOne({email: userEmail});
        // const users = await User.find({email: userEmail});
        if(!users) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch(err) {
        res.status(400).send("Error");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length === 0) {
            res.status(404).send("No user");
        } else {
            res.send(users);
        }
    } catch(err) {
        res.status(400).send("Error");
    }
});

app.get("/userById", async (req, res) => {
    const id = req.body._id;
    try {
        const users = await User.findById(id);
        if(!users) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch(err) {
        res.status(400).send("Error");
    }
});

app.delete("/user", async (req, res) => {
    const id = req.body.userId;
    try {
        await User.findByIdAndDelete(id);
        res.send("User deleted")
    } catch(err) {
        res.status(400).send("Error");
    }
});

app.patch("/userByID", async (req, res) => {
    const id = req.body._id;
    const body = req.body;
    try {
        await User.findByIdAndUpdate(id, body, {returnDocument: "before"});
        res.send("updated successfully");
    } catch(err) {
        res.status(400).send("Error");
    }
});

app.patch("/userByEmail", async (req, res) => {
    const userEmail = req.body.email;
    const body = req.body;
    try {
        await User.findOneAndUpdate({email: userEmail}, body);
        res.send("updated successfully");
    } catch(err) {
        res.status(400).send("Error");
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
