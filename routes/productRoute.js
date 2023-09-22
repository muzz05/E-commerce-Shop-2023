const { Router } = require("express");
const router = Router();
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const Product = require("../models/Products");
const fs = require("fs");
const slugify = require("slugify");
const formidableMiddleware = require("express-formidable");
const Category = require("../models/Categories");

// Route 1: This is to create a Product / Method: POST
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  async (req, res) => {
    try {
      const { name, description, slug, quantity, price, category, shipping } =
        req.fields;
      const { photo } = req.files;

      // Data Validation
      switch (true) {
        case !name:
          return res
            .status(400)
            .send({ success: false, message: "Name is required" });
        case !description:
          return res
            .status(400)
            .send({ success: false, message: "Description is required" });
        case !quantity:
          return res
            .status(400)
            .send({ success: false, message: "Quantity is required" });
        case !price:
          return res
            .status(400)
            .send({ success: false, message: "Price is required" });
        case !category:
          return res
            .status(400)
            .send({ success: false, message: "Category is required" });
        case !photo && photo.size > 1000000:
          return res.status(400).send({
            success: false,
            message: "Photo is required and Should be less than 1mb",
          });
      }

      let product = new Product({ ...req.fields, slug: slugify(name) });
      if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
      }

      product = await product.save();
      res.status(200).send({
        success: true,
        message: "Product has been created Successfully",
        product,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Some Error occured in creating the Product",
      });
    }
  }
);

//Route 2: This is to fetch all the products / Method: GET
router.get("/fetch-all", async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 });
    if (!products) {
      return res.status(400).send({
        success: false,
        message: "There are no products available to show",
      });
    }
    res.status(200).send({
      success: true,
      message: "Products have been fetched",
      total: products.length,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in fetching all the Products",
    });
  }
});

//Route 3: This is to fetch a single product / Method: GET
router.get("/single-product/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .populate("category")
      .select("-photo");
    if (!product) {
      return res.status(400).send({
        success: false,
        message: "This product does not exist",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product has been fetched",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in fetching the Product",
    });
  }
});

// Route 4: This is to get the photo of a single product / Method: GET
router.get("/product-photo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select("photo");
    if (!product) {
      return res.status(400).send({
        success: false,
        message: "This product  does not exist",
      });
    }
    res.set("Content-type", product.photo.contentType);
    res.status(200).send(product.photo.data);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in fetching the Product Photo",
    });
  }
});

// Route 5: This is to Delete a Product/ Method: DELETE
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id).select("-photo");
    res.status(200).send({
      success: true,
      message: "The Product has been deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in deleting the Product",
    });
  }
});

// Route 6: This is to update a Product / Method: PUT
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, slug, quantity, price, category, shipping } =
        req.fields;
      const { photo } = req.files;

      // Data Validation
      switch (true) {
        case !name:
          return res
            .status(400)
            .send({ success: false, message: "Name is required" });
        case !description:
          return res
            .status(400)
            .send({ success: false, message: "Description is required" });
        case !quantity:
          return res
            .status(400)
            .send({ success: false, message: "Quantity is required" });
        case !price:
          return res
            .status(400)
            .send({ success: false, message: "Price is required" });
        case !category:
          return res
            .status(400)
            .send({ success: false, message: "Category is required" });
      }

      let product = await Product.findByIdAndUpdate(
        id,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
        product = await Product.findByIdAndUpdate(id, { product });
      }
      res.status(200).send({
        success: true,
        message: "Product has been Updated Successfully",
        product,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Some Error occured in Updating the Product",
      });
    }
  }
);

//Route 7: This is filter products/ Method:POST
router.post("/product-filter", async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    res.status(200).send({ success: true, products });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in filtering the Products",
    });
  }
});

//Route  8: This is to search for products / Method:GET
router.get("/search/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.status(200).send({ success: true, results });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in Searching the Products",
    });
  }
});

//Route 9: This is to fetch all the similar products / Method: GET
router.get("/similar-products/:pid/:cid", async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(4)
      .populate("category");
    res.status(200).send({ success: true, products });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in fetching the similar products",
    });
  }
});

// Route 10: This is fetch products category wise / Method: GET
router.get("/category-wise-product/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    const products = await Product.find({ category }).populate("category");
    res.status(200).send({ success: true, category, products });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in fetching Products category wise",
    });
  }
});

// Route 11: This is to reduce the quantity of products ? Method: POST
router.post("/product-quantity-update/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    {
      $inc: { quantity: -1 },
    },
    { new: true }
  );
  res.status(200).send({ success: true, product });
});

module.exports = router;
