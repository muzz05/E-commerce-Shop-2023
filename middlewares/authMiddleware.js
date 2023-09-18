const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/User");

const requireSignIn = (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    res
      .status(401)
      .send({ success: false, message: "Login to access this Page" });
  }
};

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.role !== 1) {
    return res
      .status(401)
      .send({ success: false, message: "You are not an Admin" });
  } else {
    next();
  }
};

module.exports = { requireSignIn, isAdmin };
