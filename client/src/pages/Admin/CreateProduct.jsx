import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

function CreateProduct() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();

  // This is fetch all the categories
  const getCategories = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/category/fetch-all"
    );
    if (data.success) {
      setCategories(data.categories);
    }
  };

  // This is to create the product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    productData.append("name", name);
    productData.append("description", description);
    productData.append("price", price);
    productData.append("quantity", quantity);
    productData.append("photo", photo);
    productData.append("category", category);
    productData.append("shipping", shipping);
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/product/create-product",
      productData
    );
    if (data?.success) {
      toast.success(data.message);
      navigate("/dashboard/admin/products");
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <Layout>
      <div className="container-fluid my-2 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create product</h1>
            <div className="m-4 w-75">
              <label htmlFor="InputCategory" className="form-label">
                Category
              </label>
              <Select
                bordered={false}
                id="InputCategory"
                size="medium"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories.map((c) => {
                  return (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
              <div className="mb-3 w-75">
                <label htmlFor="formFile" className="form-label my-2">
                  Upload Photo
                </label>
                <input
                  className="form-control my-2"
                  type="file"
                  id="formFile"
                  accept="image/*"
                  onChange={(e) => {
                    setPhoto(e.target.files[0]);
                  }}
                />
              </div>
              <div className="mb-3">
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Product Image"
                      height={"100px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="InputName" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="InputName"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="InputDescription"
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputPrice" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="InputPrice"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputQuantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="InputQuantity"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputShipping" className="form-label">
                  Shipping
                </label>
                <Select
                  bordered={false}
                  id="InputShipping"
                  size="medium"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option key={"Shipping_yes"} value={"1"}>
                    Yes
                  </Option>
                  <Option key={"Shipping_no"} value={"0"}>
                    No
                  </Option>
                </Select>
              </div>
              <div className="mb-3">
                <button
                  className="btn btn-primary"
                  onClick={handleCreateProduct}
                >
                  Create Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateProduct;
