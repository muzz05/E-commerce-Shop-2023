import axios from "axios";
import { useEffect, useState } from "react";

export default function useCategory() {
  const [categories, setCategories] = useState();

  // This is to fetch all the categories
  const getCategories = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/category/fetch-all"
    );
    if (data.success) {
      setCategories(data.categories);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
