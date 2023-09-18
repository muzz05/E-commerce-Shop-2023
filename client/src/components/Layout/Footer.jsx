import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div
        className="bg-dark text-light py-2  fixed-bottom"
        style={{ height: "80px" }}
      >
        <h5 className="text-center">All rights reserved &copy; CodeWithMuzz</h5>
        <p className="text-center">
          <Link to="/about" className="footer-link">
            About
          </Link>
          |
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
          |
          <Link to="/policies" className="footer-link">
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  );
}

export default Footer;
