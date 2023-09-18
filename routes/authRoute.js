const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const { hash, comparePassword } = require("../helpers/hashing");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

// Route 1: Registration Route / Method: POST
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone, answer } = req.body;

    // Validation
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Name is required" });
    }
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ success: false, message: "Password is required" });
    }
    if (!address) {
      return res
        .status(400)
        .send({ success: false, message: "Address is required" });
    }
    if (!phone) {
      return res
        .status(400)
        .send({ success: false, message: "Phone Number is required" });
    }
    if (!answer) {
      return res
        .status(400)
        .send({ success: false, message: "Answer is required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists Please Login",
      });
    }

    // Adding the User to the database
    let user = await new User({
      name,
      email,
      address,
      phone,
      password: hash(password),
      answer,
    });
    user = await user.save();
    res
      .status(200)
      .send({ success: true, message: "The User has been created", user });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
});

// Route 2: Login Route / Method: POST
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Enter correct credentials" });
    }

    // This is to validate the User
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Email is not Registered" });
    }
    const verifyPassword = comparePassword(password, user.password);
    if (!verifyPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Incorrect Password" });
    }

    // Creating the Token
    const token = await JWT.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Logged in Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
});

// Route 3: Test Page / Method: GET
router.get("/test", requireSignIn, isAdmin, (req, res) => {
  res.send("Welcome to a protected route");
});

//Route 4: Protected User Routes / Mehtod: GET
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Route 5: Protected User Routes / Mehtod: GET
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//Route 6: Forgot Password / Method: POST
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }
    if (!answer) {
      return res
        .status(400)
        .send({ success: false, message: "Answer is required" });
    }
    if (!newPassword) {
      return res
        .status(400)
        .send({ success: false, message: "New Password is required" });
    }
    const user = await User.findOne({ email, answer });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Email or Answer is incorrect" });
    }
    await User.findByIdAndUpdate(user._id, { password: hash(newPassword) });
    res
      .status(200)
      .send({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error Occured",
      error,
    });
  }
});

//Route 6: This is to update the user credentials / Method: PUT
router.put("/profile", requireSignIn, async (req, res) => {
  const { name, address, phone } = req.body;
  if (!name) {
    return res
      .status(400)
      .send({ success: false, message: "Name is Required" });
  }
  if (!address) {
    return res
      .status(400)
      .send({ success: false, message: "Address is Required" });
  }
  if (!phone) {
    return res
      .status(400)
      .send({ success: false, message: "Phone is Required" });
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, address, phone },
    { new: true }
  ).select("name email phone address -_id");
  res.status(200).send({
    success: true,
    message: "User has been updated Successfully",
    user,
  });
});

module.exports = router;
