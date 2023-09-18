const mongoose = require("mongoose");
const OrderModal = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
    ],
    payment: {
      type: String,
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    orderStatus: {
      type: String,
      default: "Not Processing",
      enum: ["Not Processing", "Processing", "Shipped", "Delivered"],
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderModal);
