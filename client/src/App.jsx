import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/User/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoutes";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Profile from "./pages/User/Profile";
import Orders from "./pages/User/Orders";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import SingleCategoryProducts from "./pages/SingleCategoryProducts";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/cart" element={<CartPage />} />
        {/* <Route exact path="/categories" element={<Categories />} /> */}
        <Route
          exact
          path="/category/:slug"
          element={<SingleCategoryProducts />}
        />
        <Route exact path="/product/:slug" element={<ProductDetails />} />
        <Route exact path="/dashboard" element={<PrivateRoute />}>
          <Route exact path="user" element={<Dashboard />} />
          <Route exact path="user/profile" element={<Profile />} />
          <Route exact path="user/orders" element={<Orders />} />
        </Route>
        <Route exact path="/dashboard" element={<AdminRoute />}>
          <Route exact path="admin" element={<AdminDashboard />} />
          <Route
            exact
            path="admin/create-category"
            element={<CreateCategory />}
          />
          <Route
            exact
            path="admin/create-product"
            element={<CreateProduct />}
          />
          <Route exact path="admin/product/:slug" element={<UpdateProduct />} />
          <Route exact path="admin/products" element={<Products />} />
          <Route exact path="admin/users" element={<Users />} />
          <Route exact path="admin/orders" element={<AdminOrders />} />
        </Route>
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/policies" element={<Policies />} />
        <Route exact path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
