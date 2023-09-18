import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/Cart";

function SingleCategoryProducts() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [cart, setCart] = useCart();

  // This is to fetch all the products accroding to the categories
  const getProductByCategory = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/category-wise-product/${params.slug}`
    );
    if (data?.success) {
      setProducts(data.products);
      setCategory(data?.category);
    }
  };

  useEffect(() => {
    getProductByCategory();
  }, [params.slug]);
  return (
    <Layout>
      <div className="container my-4">
        <h1 className="text-center my-4">{category.name}</h1>
        <h5 className="text-center">{`${products.length} Products Found`}</h5>
        <div className="row my-4">
          {products?.map((p) => {
            return (
              <div className="col-md-4 col-xl-3">
                <div className="card my-2">
                  <img
                    src={`http://localhost:4000/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h4 className="card-title">{p.name}</h4>
                    <h5 className="card-title pricing-card-title">
                      ${p.price}
                    </h5>
                    <p className="card-text">{p.description}</p>
                    <Link
                      to={`/product/${p.slug}`}
                      className="btn btn-primary m-1 btn-sm"
                    >
                      More Details
                    </Link>
                    <button
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Added to cart successfully");
                      }}
                      className="btn btn-success m-1 btn-sm"
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

export default SingleCategoryProducts;
