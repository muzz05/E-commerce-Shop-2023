import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/Auth";

function CartPage() {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  return (
    <Layout>
      <div className="container my-3">
        <h2 className="text-center">Cart</h2>
      </div>
    </Layout>
  );
}

export default CartPage;
