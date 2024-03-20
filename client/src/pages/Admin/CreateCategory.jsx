import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Forms/CategoryForm";
import { Modal, message } from "antd";

function CreateCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState(null);
  const [selected, setSelected] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");

  // This is fetch all the categories
  const getCategories = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/category/fetch-all"
    );
    if (data.success) {
      setCategories(data.categories);
    }
  };

  // This is to fetch all the categories on refresh
  useEffect(() => {
    getCategories();
  }, []);

  // This is to create a category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const categoryData = new FormData();
    categoryData.append("name", name);
    categoryData.append("photo", photo);
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/category/create-category",
      categoryData
    );
    if (data.success) {
      messageApi.open({
        type: "success",
        content: data?.message,
      });
      setName("");
      setPhoto("");
    } else {
      messageApi.open({
        type: "error",
        content: data?.message,
      });
    }
    getCategories();
  };

  // This is to update Category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const categoryData = new FormData();
    categoryData.append("name", updatedName);
    categoryData.append("photo", photo);
    const { data } = await axios.put(
      `http://localhost:4000/api/v1/category/update-category/${selected._id}`,
      categoryData
    );
    if (data.success) {
      messageApi.open({
        type: "success",
        content: data?.message,
      });
      setSelected(null);
      setName("");
      setUpdatedName("");
      setVisible(false);
      setPhoto("");
      window.location.reload();
    } else {
      messageApi.open({
        type: "error",
        content: data?.message,
      });
    }
    getCategories();
  };

  // This is to Delete Category
  const handleDelete = async (id) => {
    const { data } = await axios.delete(
      `http://localhost:4000/api/v1/category/delete-category/${id}`
    );
    if (data.success) {
      messageApi.open({
        type: "success",
        content: data?.message,
      });
    } else {
      messageApi.open({
        type: "error",
        content: data?.message,
      });
    }
    getCategories();
  };
  return (
    <Layout>
      {contextHolder}
      <div className="container-fluid my-2 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="my-2">Manage category</h1>
            <div className="p-3 w-50">
              <form onSubmit={handleCreateCategory}>
                <div className="mb-3">
                  <label
                    htmlFor="exampleInputCategoryName"
                    className="form-label"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputCategoryName"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3 w-75">
                  <label htmlFor="formFile" className="form-label my-2">
                    Upload Photo
                  </label>
                  <input
                    className="form-control my-2"
                    type="file"
                    id="formFile"
                    accept="image/*"
                    onChange={(e) => {
                      setPhoto(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="mb-3">
                  {photo && (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Product Image"
                        height={"100px"}
                        className="img img-responsive"
                      />
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary my-2">
                  Submit
                </button>
              </form>
            </div>
            <div className="container my-4 mx-3">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Photo</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => {
                    return (
                      <>
                        <tr>
                          <td scope="col" key={c._id}>
                            {c.name}
                          </td>
                          <td>
                            <img
                              src={`http://localhost:4000/api/v1/category/category-photo/${c._id}`}
                              alt="Category Photo"
                              style={{ width: "50px" }}
                              className="rounded"
                            />
                          </td>
                          <td scope="col">
                            <button
                              className="btn btn-primary ms-2"
                              onClick={() => {
                                setVisible(true);
                                setUpdatedName(c.name);
                                setSelected(c);
                                setPhoto(c.photo);
                                setId(c._id);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger ms-2"
                              onClick={() => {
                                handleDelete(c._id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => {
                setVisible(false);
              }}
              footer={null}
              open={visible}
            >
              <form onSubmit={handleUpdateCategory}>
                <div className="mb-3">
                  <label
                    htmlFor="exampleInputCategoryName"
                    className="form-label"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputCategoryName"
                    value={updatedName}
                    onChange={(e) => {
                      setUpdatedName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3 w-75">
                  <label htmlFor="formFile" className="form-label my-2">
                    Upload Photo
                  </label>
                  <input
                    className="form-control my-2"
                    type="file"
                    id="formFile"
                    accept="image/*"
                    defaultValue={photo}
                    onChange={(e) => {
                      setPhoto(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="mb-3">
                  {photo ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Product Image"
                        height={"100px"}
                        className="img img-responsive rounded"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={`http://localhost:4000/api/v1/category/category-photo/${id}`}
                        alt="Category Photo"
                        style={{ width: "50px" }}
                        className="img img-responsive rounded"
                      />
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary my-2">
                  Update
                </button>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCategory;
