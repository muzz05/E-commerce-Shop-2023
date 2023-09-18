const mongoose = require("mongoose");

connectMongoDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/e-commerce-2023")
    .then(() => {
      console.log("Connected to Database...");
    })
    .catch(() => {
      console.log("Some Error occured in the Database...");
    });
};

module.exports = connectMongoDB;
