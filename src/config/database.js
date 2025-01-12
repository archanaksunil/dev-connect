const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://archanaksunil:7MjIbU64b5lSPXMx@cluster0.3bge3.mongodb.net/devconnect");
}

module.exports = connectDb;