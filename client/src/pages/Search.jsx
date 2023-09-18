import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/Search";
import { Link } from "react-router-dom";
import { useCart } from "../context/Cart";

function Search() {
  const [values, setValues] = useSearch();
  const [cart, setCart] = useCart();
  return (
    <Layout>
      <div className="container">
        <div className="text-center">
          <h1 className="my-4">Search Result</h1>
          <h4>
            {values.results.length < 1
              ? "No Products Found"
              : `Found ${values.results.length} Products`}
          </h4>
          <div className="row my-3">
            {values?.results.map((p) => {
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
                        to={`product/${p.slug}`}
                        className="btn btn-primary m-1"
                      >
                        More Details
                      </Link>
                      <button
                        className="btn btn-success m-1"
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
      </div>
    </Layout>
  );
}

export default Search;
