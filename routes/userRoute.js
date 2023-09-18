const { Router } = require("express");
const router = Router();
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const mongoose = require("mongoose");

// Route 1: This is to fetch all the users except the admins
router.get("/fetch-all", requireSignIn, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 0 }).select("-password");
    res.status(200).send({ success: true, users });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some error occured in fetching all the users",
    });
  }
});

// Route 2: This is remove the user
router.delete("/delete-user/:id", requireSignIn, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await User.findByIdAndDelete(id);
    res
      .status(200)
      .send({
        success: true,
        message: "User Has been Delted Successfully",
        user,
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some error occured in deleting the users",
    });
  }
});

module.exports = router;
