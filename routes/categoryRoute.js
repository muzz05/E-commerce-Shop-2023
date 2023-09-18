const { Router } = require("express");
const router = Router();
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const Category = require("../models/Categories");
const slugify = require("slugify");
const formidableMiddleware = require("express-formidable");
const fs = require("fs");

// Route 1: This is to create the category / Method: POST
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  async (req, res) => {
    try {
      // This is to validate the data
      const { name } = req.fields;
      const { photo } = req.files;
      if (!name) {
        return res
          .status(400)
          .send({ success: false, message: "Name is required" });
      }
      if (!photo && photo.size > 1000000) {
        return res.status(400).send({
          success: false,
          message: "Photo is required and should be less than 10mb",
        });
      }

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res
          .status(400)
          .send({ success: false, message: "Category already exists" });
      }

      let category = new Category({ name, slug: slugify(name) });
      if (photo) {
        category.photo.data = fs.readFileSync(photo.path);
        category.photo.contentType = photo.type;
      }
      category = await category.save();
      res.status(200).send({
        success: true,
        message: "Category has been created Successfully",
        category,
      });
    } catch (error) {
      res.status(500).send({
        succes: false,
        message: "Some Error occured in Creating the Category",
      });
    }
  }
);

// Route 2: This is to update the category / Method: PUT
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  async (req, res) => {
    try {
      const { name } = req.fields;
      const { id } = req.params;
      const { photo } = req.files;
      let category = await Category.findById(id);
      if (!category) {
        return res
          .status(400)
          .send({ success: false, message: "This Category does not exist" });
      }

      if (photo) {
        let UploadPhoto = {};
        UploadPhoto.data = fs.readFileSync(photo.path);
        UploadPhoto.contentType = photo.type;

        category = await Category.findByIdAndUpdate(
          id,
          { name, slug: slugify(name), photo: UploadPhoto },
          { new: true }
        );
      }
      if (!photo) {
        category = await Category.findByIdAndUpdate(
          id,
          { name, slug: slugify(name) },
          { new: true }
        );
      }
      res.status(200).send({
        success: true,
        message: "The Category has been updated Successfully",
        category,
      });
    } catch (error) {
      res.status(500).send({
        succes: false,
        message: "Some Error occured in Updating the Category",
      });
    }
  }
);

// Route 3: This is to get all the categories / Method: GET
router.get("/fetch-all", async (req, res) => {
  try {
    const categories = await Category.find().select("-photo");
    res
      .status(200)
      .send({ success: true, message: "The Category List", categories });
  } catch (error) {
    res.status(500).send({
      succes: false,
      message: "Some Error occured in Fetching all the Categories",
    });
  }
});

// Route 4: This is to get a single categories / Method: GET
router.get("/single-category/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res
        .status(400)
        .send({ success: false, message: "This Category does not exist" });
    }
    res.status(200).send({
      success: true,
      message: "The Category has been fetched",
      category,
    });
  } catch (error) {
    res.status(500).send({
      succes: false,
      message: "Some Error occured in Fetching the Categories",
    });
  }
});

// Route 5: This is to delete the category / Method: DELETE
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      let category = await Category.findById(id);
      if (!category) {
        return res
          .status(400)
          .send({ success: false, message: "This Category does not exist" });
      }
      category = await Category.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "The Category has been Deleted Successfully",
      });
    } catch (error) {
      res.status(500).send({
        succes: false,
        message: "Some Error occured in Deleting the Category",
      });
    }
  }
);

// Route 6: This is to get the photo of a single Category / Method: GET
router.get("/category-photo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).select("photo");
    if (!category) {
      return res.status(400).send({
        success: false,
        message: "This product  does not exist",
      });
    }
    res.set("Content-type", category.photo.contentType);
    res.status(200).send(category.photo.data);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error occured in fetching the Product Photo",
    });
  }
});

module.exports = router;
