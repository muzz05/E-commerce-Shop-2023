import React, { useEffect, useState } from "react";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/Auth";
import { Radio } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function ChheckoutModal() {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [payment, setPayment] = useState("");
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // This is to calculate the total price
  const totalPrice = () => {
    let totalPrice = 0;
    cart?.map((item) => {
      totalPrice = totalPrice + item.price;
    });
    setTotal(totalPrice);
  };

  // This is to place the Order
  const handlePlaceOrder = async () => {
    cart.map(async (p) => {
      const { data } = await axios.post(
        `http://localhost:4000/api/v1/product/product-quantity-update/${p._id}`
      );
      console.log(data);
    });
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/order/place-order",
      { cart, payment, total }
    );
    if (data.success) {
      toast.success(data.message);
      setCart([]);
      localStorage.removeItem("cart");
    } else toast.error(data.message);
  };

  useEffect(() => {
    totalPrice();
  }, [cart]);
  return (
    <>
      <div
        className="modal fade"
        id="CheckoutModal"
        tabIndex={-1}
        aria-labelledby="CheckoutModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-center mx-auto" id="CartModalLabel">
                Checkout
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="container">
                {auth?.user?.address && (
                  <>
                    <div className="row py-2">
                      <div className="col-md-4">
                        <h5>Current Address:</h5>
                      </div>
                      <div className="col-md-6">
                        <h6>{auth.user.address}</h6>
                      </div>
                    </div>
                    <div className="row py-2">
                      <div className="col-md-4">
                        <h5>Phone Number:</h5>
                      </div>
                      <div className="col-md-6">
                        <h6>{auth.user.phone}</h6>
                      </div>
                    </div>
                    <div className="row py-2">
                      <div className="col-md-4">
                        <h5>Email:</h5>
                      </div>
                      <div className="col-md-6">
                        <h6>{auth.user.email}</h6>
                      </div>
                    </div>
                    <div className="row py-2">
                      <div className="col-md-4">
                        <h5>Payment Method:</h5>
                      </div>
                      <div className="col-md-6">
                        <Radio.Group
                          onChange={(e) => {
                            setPayment(e.target.value);
                          }}
                        >
                          <Radio value={"COD"}> Cash on Delivery</Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-around">
              <h6>
                <strong>Total: </strong>
                {total.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </h6>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm my-1 mx-1"
                  data-bs-target="#CartModal"
                  data-bs-toggle="modal"
                >
                  Cart
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm my-1 mx-1"
                  onClick={handlePlaceOrder}
                  data-bs-dismiss="modal"
                  disabled={payment ? false : true}
                >
                  Place Order
                </button>
                <button
                  className="btn btn-warning btn-sm my-1 mx-1"
                  onClick={() => {
                    navigate("/dashboard/user/profile");
                  }}
                  data-bs-dismiss="modal"
                >
                  Update Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChheckoutModal;
