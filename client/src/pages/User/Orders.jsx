import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import moment from "moment";

function Orders() {
  const [orders, setOrders] = useState([]);

  // This is used to get the orders made by the user
  const getOrdersByUser = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/order/user-orders"
    );
    if (data.success) {
      setOrders(data.orders);
    }
  };

  useEffect(() => {
    getOrdersByUser();
  }, []);
  return (
    <Layout>
      <div className="container-fluid my-2 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="container my-2">
              <h1 className="text-center my-4">Orders</h1>
              <div className="container w-75 my-4">
                {orders.length === 0 && (
                  <h5 className="text-center">You Have Made No Orders</h5>
                )}
                {orders.map((o, i) => {
                  return (
                    <>
                      <table className="table my-4">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Date</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{i + 1}</td>
                            <td>{o?.orderStatus}</td>
                            <td>{moment(o?.createdAt).fromNow()}</td>
                            <td>{o?.payment}</td>
                            <td>{o?.products.length}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        className="container w-50 my-2  p-4"
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#F1F2F3",
                        }}
                      >
                        {o?.products.map((p) => {
                          return (
                            <>
                              <div
                                key={p._id}
                                className="row my-2"
                                style={{ borderRadius: "5px" }}
                              >
                                <div className="col-md-3 my-3">
                                  <img
                                    src={`http://localhost:4000/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top"
                                    alt={p.name}
                                    style={{ borderRadius: "10px" }}
                                  />
                                </div>
                                <div className="col-md-8 my-3">
                                  <p className="my-1">
                                    <strong>Name: </strong> {p.name}
                                  </p>
                                  <p className="my-1">
                                    <strong>Price: </strong> ${p.price}
                                  </p>
                                </div>
                              </div>
                              <hr />
                            </>
                          );
                        })}
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
