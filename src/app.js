const express = require("express");

const app = express();

app.use("/test", (req,res)=> {
    res.send("testing");
});

app.use("/hello", (req,res)=> {
    res.send("hello");
});

app.use("/", (req, res)=> {
    res.send("Default");
});

app.listen(7777, ()=>{console.log("listening")})