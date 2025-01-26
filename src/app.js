const express = require("express");
const connectDb = require("./config/database");
const cookieparser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieparser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
