import { useEffect, useState } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  // This checks if the user has the correct authentication token using the backend authentication
  useEffect(() => {
    // This function checks if the user is autharized
    const AuthCheck = async () => {
      const res = await axios.get(
        "http://localhost:4000/api/v1/auth/user-auth"
      );
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) AuthCheck();
  }, [auth?.token]);

  //If the user is authorized it shows the Page if Not it shows the component spinner
  return ok ? <Outlet /> : <Spinner />;
}
