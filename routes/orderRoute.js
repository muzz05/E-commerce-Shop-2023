const { Router } = require("express");
const router = Router();
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const Order = require("../models/Orders");
const Products = require("../models/Products");

// Route 1: This is to place the order / Method: POST
router.post("/place-order", requireSignIn, async (req, res) => {
  const { cart, payment, total } = req.body;
  if (!cart) {
    return res
      .status(400)
      .send({ success: false, message: "You have no products in your cart" });
  }
  if (!payment) {
    return res
      .status(400)
      .send({ success: false, message: "You have to choose a payment method" });
  }
  if (!total) {
    return res
      .status(400)
      .send({ success: false, message: "Total is required" });
  }
  let order = new Order({
    products: cart,
    buyer: req.user._id,
    payment,
    total,
  });
  order = order.save();
  res
    .status(200)
    .send({ success: true, message: "Order Places successfully", order });
});

// Route 2: This is to fetch all the orders made by the user
router.get("/user-orders", requireSignIn, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).send({ success: true, orders });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Some Error occured while fetching Orders",
    });
  }
});

// Route 3: This is to fetch all Orders
router.get("/fetch-all", requireSignIn, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.status(200).send({ success: true, orders });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Some Error occured while fetching Orders",
    });
  }
});

// Route 4: This is to update the order status
router.put("/update-status/:id", requireSignIn, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    if (!orderStatus) {
      return res
        .status(400)
        .send({ success: false, message: "OrderStatus is required" });
    }
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );
    res.status(200).send({ success: true, order });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Some Error occured while fetching Orders",
    });
  }
});

module.exports = router;
