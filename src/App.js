import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // needed for dropdowns

import axios from "axios";
import { useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import CustomerDashboard from "./customerDashboard";
import AdminDashboard from "./adminDashboard";
import Header from "./header";
import UploadProducts from "./uploadProducts";
import Cart from "./cart";

import Account from "./account";
import MyOrders from "./myOrders";
import Footer from "./footer";
import ProductDetails from "./productDetails";
import Home from "./home";
import LoginRegisterPage from "./loginRegisterPage";
function App() {
  const [loginStatus, setLoginStatus] = useState({
    Status: null,
    Message: "",
    Role: null,
    Name: "",
    Id: "",
  });
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [accountDetails, setAccountDetails] = useState();
  const [userSearch, setUserSearch] = useState("");
  // console.log(loginStatus);
  return (
    <div>
      <div style={{ height: "48px ", background: "black" }}></div>
      <BrowserRouter>
        <Header
          loginStatus={loginStatus}
          setLoginStatus={setLoginStatus}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          product={product}
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
          accountDetails={accountDetails}
          setAccountDetails={setAccountDetails}
        />

        <Routes>
          <Route path="/x" element={<LoginRegisterPage />} />
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route
          path="/"
          element={
            <Login
              loginStatus={loginStatus}
              setLoginStatus={setLoginStatus}
              accountDetails={accountDetails}
              setAccountDetails={setAccountDetails}
            />
          }
        /> */}
          <Route
            path="/customerDashboard"
            element={
              <CustomerDashboard
                product={product}
                setProduct={setProduct}
                filteredProducts={filteredProducts}
                setFilteredProducts={setFilteredProducts}
                loginStatus={loginStatus}
                setLoginStatus={setLoginStatus}
                setAccountDetails={setAccountDetails}
                accountDetails={accountDetails}
              />
            }
          />
          <Route
            path="/adminDashboard"
            element={
              loginStatus?.Status == true && loginStatus?.Role == 1 ? (
                <AdminDashboard
                  product={product}
                  setProduct={setProduct}
                  filteredProducts={filteredProducts}
                  setFilteredProducts={setFilteredProducts}
                  loginStatus={loginStatus}
                  setLoginStatus={setLoginStatus}
                  setAccountDetails={setAccountDetails}
                  accountDetails={accountDetails}
                />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          <Route
            path="/uploadProducts"
            element={
              loginStatus?.Status == true && loginStatus?.Role == 1 ? (
                <UploadProducts />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          <Route
            path="/cart"
            element={
              loginStatus?.Status == true && loginStatus?.Role == 0 ? (
                <Cart
                  filteredProducts={filteredProducts}
                  loginStatus={loginStatus}
                />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          <Route
            path="/account"
            element={
              loginStatus.Status == true ? (
                <Account
                  accountDetails={accountDetails}
                  setAccountDetails={setAccountDetails}
                  loginStatus={loginStatus}
                />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          <Route
            path="/orders"
            element={
              loginStatus?.Status == true && loginStatus?.Role == 0 ? (
                <MyOrders
                  accountDetails={accountDetails}
                  setAccountDetails={setAccountDetails}
                  loginStatus={loginStatus}
                />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          <Route
            path="/product/:params"
            element={
              <ProductDetails
                loginStatus={loginStatus}
                setLoginStatus={setLoginStatus}
                setAccountDetails={setAccountDetails}
                accountDetails={accountDetails}
              />
            }
          />
          <Route path="*" element={<Home loginStatus={loginStatus} />} />
          <Route path="/" element={<Home loginStatus={loginStatus} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
