import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState();

  const getAllProducts = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/product/fetch-all"
    );
    if (data?.success) {
      setProducts(data.products);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <Layout>
      <div className="container-fluid my-2 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-8">
            <h1>All Products</h1>
            <div className="row my-3">
              {products?.map((p) => {
                return (
                  <div
                    className="col-md-4 col-lg-3"
                    key={`Admin-Products-${p._id}`}
                  >
                    <div className="card my-2">
                      <img
                        src={`http://localhost:4000/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <h6 className="card-title pricing-card-title">
                          ${p.price}
                        </h6>
                        <p className="card-text">{p.description}</p>
                        <Link
                          to={`/dashboard/admin/product/${p.slug}`}
                          className="btn btn-primary"
                        >
                          Product
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Products;
