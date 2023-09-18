import React from "react";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/Auth";
import { Link, useNavigate } from "react-router-dom";

function CartModal() {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  // This is to remove item from the cart
  const removeCartItem = (p) => {
    try {
      let oldcart = [...cart];
      let index = oldcart.indexOf(p);
      let firstPart = oldcart.slice(0, index);
      let secondPart = oldcart.slice(index + 1);
      let newcart = firstPart.concat(secondPart);
      setCart(newcart);
      localStorage.setItem("cart", JSON.stringify(newcart));
    } catch (error) {
      console.log(error);
    }
  };

  // this is to calculate the total price
  const totalPrice = () => {
    let total = 0;
    cart?.map((item) => {
      total = total + item.price;
    });
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  return (
    <>
      <div
        className="modal fade"
        id="CartModal"
        tabIndex={-1}
        aria-labelledby="CartModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-center mx-auto" id="CartModalLabel">
                Cart - Ecommerce Shop
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
                {cart.length === 0 && (
                  <h5 className="text-center my-2">
                    You have No items in your Cart
                  </h5>
                )}
                {!auth.user && (
                  <h5 className="text-center mb-3">
                    Login to Checkout{" "}
                    <button
                      className="btn btn-primary btn-sm mx-2"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Login
                    </button>
                  </h5>
                )}
                {cart?.map((p) => {
                  return (
                    <>
                      <div
                        key={`Cart-items-${p._id}`}
                        className="row border my-2"
                        style={{ borderRadius: "5px" }}
                      >
                        <div className="col-md-4 my-3">
                          <img
                            src={`http://localhost:4000/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            style={{ borderRadius: "10px" }}
                          />
                        </div>
                        <div className="col-md-5 my-3">
                          <p className="my-1">
                            <strong>Name: </strong> {p.name}
                          </p>
                          <p className="my-1">
                            <strong>Price: </strong> ${p.price}
                          </p>
                          <p className="my-">
                            <strong>Category: </strong> {p.category?.name}
                          </p>
                        </div>
                        <div className="col-md-2 position-relative">
                          <button
                            className="btn btn-danger position-absolute bottom-0 end-0 my-3 mx-2 btn-sm"
                            onClick={() => {
                              removeCartItem(p);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-around">
              <h5 className="my-2">
                <strong>Total: </strong> {totalPrice()}
              </h5>
              <div className="my-2">
                <button
                  type="button"
                  className="btn btn-secondary mx-1"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary mx-1"
                  data-bs-target="#CheckoutModal"
                  data-bs-toggle="modal"
                  disabled={auth?.user ? false : true}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartModal;
