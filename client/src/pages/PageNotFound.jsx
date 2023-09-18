import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <>
      <Layout>
        <div className="pnf-container" style={{ height: "70vh" }}>
          <h1 className="text-center pnf-heading my-3">404</h1>
          <p className="text-center my-3 pnf-message">Oops! Page Not Found</p>
          <p className="text-center my-3">
            <Link
              className="btn btn-secondary mx-4 btn-lg"
              to="/"
              role="button"
            >
              Go Back
            </Link>
          </p>
        </div>
      </Layout>
    </>
  );
}

export default PageNotFound;
