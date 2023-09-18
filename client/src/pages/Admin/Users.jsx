import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import moment from "moment";
import axios from "axios";
import { message } from "antd";

function Users() {
  const [users, setUsers] = useState();
  const [messageApi, contextHolder] = message.useMessage();

  // This is to fetch all the users except the admins
  const getAllUsers = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/user/fetch-all"
    );
    if (data.success) {
      setUsers(data.users);
    }
  };

  // This is to delete a user
  const deleteUser = async (id) => {
    const { data } = await axios.delete(
      `http://localhost:4000/api/v1/user/delete-user/${id}`
    );
    if (data.success) {
      messageApi.open({
        type: "success",
        content: data?.message,
      });
      getAllUsers();
    } else {
      messageApi.open({
        type: "error",
        content: data?.message,
      });
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <Layout>
      {contextHolder}
      <div className="container-fluid my-2 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Users</h1>
            <table className="table my-4">
              <thead>
                <tr>
                  <th role="col">Name</th>
                  <th role="col">Address</th>
                  <th role="col">Email</th>
                  <th role="col">Phone</th>
                  <th role="col">Registration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => {
                  return (
                    <tr>
                      <td>{u.name}</td>
                      <td>{u.address}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{moment(u.createdAt).fromNow()}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteUser(u._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Users;
