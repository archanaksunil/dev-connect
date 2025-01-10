const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getData", (req, res) => {
  res.send("yes!!");
});

app.get("/user/:id", userAuth, (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Archana", lastName: "Sunil" });
});

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({ firstName: "Archana", lastName: "Sunil" });
});

app.post("/user", (req, res) => {
  res.send("saved in db");
});

app.delete("/user", (req, res) => {
throw new Error;
  res.send("deleted");
});

app.patch("/user", (req, res) => {
  res.send("patched");
});

app.put("/user", (req, res) => {
  res.send("put");
});

app.use(
  "/test",
  [
    (req, res, next) => {
      // res.send("testing 1");
      next();
    },
    (req, res, next) => {
      // res.send("testing 2");
      next();
    },
  ],
  (req, res, next) => {
    res.send("testing 3");
  },
  (req, res, next) => {
    res.send("testing 4");
  }
);

// app.use("/hello", (req, res) => {
//   res.send("hello");
// });

// app.use("/", (req, res) => {
//   res.send("Default");
// });

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Error");
  }
});

app.listen(7777, () => {
  console.log("listening");
});
