import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // This is to get the athorization headers by default
  axios.defaults.headers.common["Authorization"] = auth?.token;

  //This is to get the authentication token from the local storage after reload if the user is not logged out
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsedData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parsedData.user,
        token: parsedData.token,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Authentication Hook
const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
