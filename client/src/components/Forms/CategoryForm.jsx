import React, { useState } from "react";

function CategoryForm({ handleOnSubmit, value, setValue }) {
  const [photo, setPhoto] = useState("");
  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputCategoryName" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputCategoryName"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
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
    </>
  );
}

export default CategoryForm;
