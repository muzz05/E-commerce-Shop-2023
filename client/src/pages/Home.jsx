import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { Checkbox, Radio, InputNumber } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/Cart";
import toast from "react-hot-toast";

function Home() {
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState("");
  const [cart, setCart] = useCart();
  const [productQuantity, setProductQuantity] = useState(1);

  // This is fetch all the categories
  const getCategories = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/category/fetch-all"
    );
    setCategories(data.categories);
  };

  // This is to fetch all the
  const getAllProducts = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/product/fetch-all"
    );
    setProducts(data.products);
  };

  // This is to get the id of the checked category boxes
  const handleCategoryFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      const index = all.indexOf(id);
      all.splice(index, 1);
    }
    setChecked(all);
  };

  //This is to filter the products
  const getFilteredProducts = async () => {
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/product/product-filter",
      { checked, radio }
    );
    setProducts(data?.products);
  };

  useEffect(() => {
    if (!checked.lenght || !radio.length) getAllProducts();
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getFilteredProducts();
  }, [checked, radio]);
  return (
    <>
      <Layout>
        <div
          className="modal fade"
          id="filterModal"
          tabIndex={-1}
          aria-labelledby="filterModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="filterModalLabel">
                  Filter
                </h1>
              </div>
              <div className="modal-body">
                <h3 className="text-center my-3">Filter By Category</h3>
                <div className="d-flex flex-column px-4">
                  {categories?.map((c) => {
                    return (
                      <Checkbox
                        key={c._id}
                        onChange={(e) => {
                          handleCategoryFilter(e.target.checked, c._id);
                        }}
                      >
                        {c.name}
                      </Checkbox>
                    );
                  })}
                </div>
                <h3 className="text-center my-3">Filter By Price</h3>
                <div className="d-flex flex-column px-4 my-4">
                  <Radio.Group
                    onChange={(e) => {
                      setRadio(e.target.value);
                    }}
                  >
                    {Prices.map((p) => {
                      return (
                        <div key={p.id}>
                          <Radio value={p.array}>{p.name}</Radio>
                        </div>
                      );
                    })}
                  </Radio.Group>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Apply Filter
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container my-3">
          <div
            className="d-flex align-items-center home-category-slider-box"
            style={{ overflowX: "auto" }}
          >
            {categories.map((c) => {
              return (
                <div className="m-4" key={`home-category-${c._id}`}>
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <Link
                      to={`/category/${c.slug}`}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <img
                        src={`http://localhost:4000/api/v1/category/category-photo/${c._id}`}
                        alt="Category Photo"
                        style={{ width: "100px", borderRadius: "100%" }}
                        className="img img-responsive"
                      />
                      <h5 className="text-center my-2">{c.name}</h5>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <hr />
        <div className="container-fluid my-2 p-1" style={{ width: "85vw" }}>
          <div className="row">
            <div className="col-md-1 d-flex align-items-center justify-content-center my-2">
              <Link
                data-bs-toggle="modal"
                data-bs-target="#filterModal"
                className="p-2 border"
                style={{ borderRadius: "8px" }}
              >
                <i
                  className="fa-solid fa-filter col-md-1 fa-sm m-auto"
                  style={{ color: "#30343b" }}
                />
              </Link>
            </div>
            <div className="col-md-11 my-2">
              <h1 className="text-center">Products</h1>
            </div>
          </div>
          <div className="row my-3">
            {products?.map((p) => {
              return (
                <div
                  className="col-md-3 col-xl-2 col-sm-4 col-12"
                  key={`home-all-products-${p._id}`}
                >
                  <div className="card my-2">
                    <img
                      src={`http://localhost:4000/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />

                    <div className="card-body">
                      <h6 className="card-title">{p.name}</h6>
                      <h6 className="card-title pricing-card-title">
                        <strong>${p.price}</strong>
                      </h6>
                      <Link
                        className="btn btn-success m-1 btn-sm"
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                          );
                          toast.success("Added to cart successfully");
                        }}
                      >
                        Add to Cart
                      </Link>
                      <Link
                        className="btn btn-primary m-1 btn-sm float-right"
                        to={`/product/${p.slug}`}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Home;
