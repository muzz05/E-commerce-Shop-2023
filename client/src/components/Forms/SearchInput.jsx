import React from "react";
import { useSearch } from "../../context/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchInput() {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/search/${values.keyword}`
    );
    setValues({ ...values, results: data.results });
    navigate("/search");
  };
  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => {
            setValues({ ...values, keyword: e.target.value });
          }}
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchInput;
