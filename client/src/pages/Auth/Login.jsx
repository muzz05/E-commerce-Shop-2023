import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Form Submit Handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/v1/auth/login", {
        password,
        email,
      });
      if (res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        // This is to add the authentication token in the local storage on Login
        localStorage.setItem("auth", JSON.stringify(res.data));
        toast.success(res.data && res.data.message);

        // This is to check if there is any location history if not it redirects the user to home page
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Some Went Wrong");
    }
  };

  return (
    <>
      <Layout>
        <div className="register my-4">
          <h1 className="my-4 text-center">Login Form</h1>
          <form className="my-2" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mx-2">
              Login
            </button>
            <button
              className="btn btn-primary mx-2"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default Login;
