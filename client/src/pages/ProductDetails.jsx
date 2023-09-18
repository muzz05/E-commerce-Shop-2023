import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/Cart";

function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  // This is to fetch a single product
  const getSingleProduct = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/single-product/${params.slug}`
    );
    if (data?.success) {
      setProduct(data.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
    }
  };

  // This is to fetch the similar products
  const getSimilarProducts = async (pid, cid) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/similar-products/${pid}/${cid}`
    );
    if (data?.success) {
      setRelatedProducts(data.products);
    }
  };
  useEffect(() => {
    getSingleProduct();
  }, []);

  return (
    <Layout>
      <div className="container my-4">
        <div className="row">
          <div className="col-md-3">
            <img
              src={`http://localhost:4000/api/v1/product/product-photo/${product._id}`}
              className="card-img-top"
              alt={product.name}
              style={{ borderRadius: "10px" }}
            />
          </div>
          <div className="col-md-5 mx-4">
            <h4 className="text-center my-3">Product Details</h4>
            <p className="my-2">
              <strong>Name: </strong> {product.name}
            </p>
            <p className="my-2">
              <strong>Description: </strong> {product.description}
            </p>
            <p className="my-2">
              <strong>Price: </strong> ${product.price}
            </p>
            <p className="my-2">
              <strong>Category: </strong> {product.category?.name}
            </p>
            <button
              onClick={() => {
                setCart([...cart, product]);
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product])
                );
                toast.success("Added to cart successfully");
              }}
              className="btn btn-success my-3"
            >
              Add to Cart
            </button>
          </div>
        </div>
        <hr />
        <div className="row">
          <h3 className="text-center my-4">Similar Products</h3>
          {relatedProducts.length < 1 && (
            <p className="text-center">There are not similar products</p>
          )}
          {relatedProducts?.map((p) => {
            return (
              <div className="col-md-4 col-xl-3">
                <div className="card my-2">
                  <img
                    src={`http://localhost:4000/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    width={"70px"}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <h6 className="card-title pricing-card-title">
                      ${p.price}
                    </h6>
                    <p className="card-text">{p.description}</p>
                    <button
                      to=""
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
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetails;
