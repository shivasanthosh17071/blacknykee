import axios from "axios";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "./reducer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./footer";
import "react-toastify/dist/ReactToastify.css";
import Login from "./login";
import Register from "./register";
import banner1 from "./Images/banner1.png";
import banner2 from "./Images/banner2.png";
import banner3 from "./Images/banner3.png";
import banner4 from "./Images/banner4.png";
import banner5 from "./Images/banner5.png";
import BASE_URL from "./config/api";

function CustomerDashboard({
  filteredProducts,
  setFilteredProducts,
  product,
  setProduct,
  loginStatus,
  setLoginStatus,
  setAccountDetails,
  accountDetails,
  showDropdown,
  setShowDropdown,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [registerForm, setRegisterForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const isAdmin = loginStatus.Status && loginStatus.Role === 1;
  const isCustomer = loginStatus.Status && loginStatus.Role === 0;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/getProducts`)
      .then((res) => {
        setProduct(res.data.result);
        setFilteredProducts(res.data.result);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...product];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "low") {
      filtered.sort((a, b) => a.Price - b.Price);
    } else if (sortBy === "high") {
      filtered.sort((a, b) => b.Price - a.Price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.Rating - a.Rating);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, product, setFilteredProducts]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts([]);
      navigate(isAdmin ? "/adminDashboard" : "/customerDashboard");
    } else {
      const filtered = product.filter(
        (item) => item.Category === selectedCategory
      );
      setFilteredProducts(filtered);
      navigate(isAdmin ? "/adminDashboard" : "/customerDashboard");
    }
  }, [selectedCategory]);

  function resetFilters() {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("");
    setFilteredProducts(product);
  }

  function addToCartFunction(item) {
    axios
      .post(`${BASE_URL}/${loginStatus.Id}/addToCart`, {
        Title: item.Title,
        Price: item.Price,
        Category: item.Description,
        Rating: item.Rating,
        Thumbnail: `data:image/jpeg;base64,${Buffer.from(
          item.Thumbnail.data
        ).toString("base64")}`,
        Id: item._id,
      })
      .catch((err) => console.log(err));
  }

  const ProductShimmer = () => (
    <div className="col">
      <div className="card shadow-sm border-light p-2">
        <div
          className="mb-2 shimmer"
          style={{ height: "180px", borderRadius: "5px" }}
        ></div>
        <div
          className="shimmer mb-2"
          style={{ height: "15px", width: "80%" }}
        ></div>
        <div
          className="shimmer mb-2"
          style={{ height: "12px", width: "60%" }}
        ></div>
        <div
          className="shimmer mb-2"
          style={{ height: "12px", width: "50%" }}
        ></div>
        <div
          className="shimmer"
          style={{ height: "35px", width: "100%" }}
        ></div>
      </div>
    </div>
  );

  return (
    <div onClick={() => setShowDropdown(false)}>
      <div style={{ backgroundImage: "linear-gradient(#fff, #fff)" }}>
        {/* Carousel */}
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {[banner1, banner2, banner3, banner4, banner5].map((img, i) => (
              <div
                className={`carousel-item ${i === 0 ? "active" : ""}`}
                key={i}
              >
                <img src={img} className="d-block w-100" alt="banner" />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            position: "sticky",
            top: "72px",
            zIndex: "100",
            overflowX: "auto",
          }}
        >
          <div className="d-flex flex-nowrap align-items-center gap-2 bg-light px-2 py-2">
            <div
              className="input-group input-group-sm"
              style={{ minWidth: "180px" }}
            >
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div
              className="input-group input-group-sm"
              style={{ minWidth: "150px" }}
            >
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-filter-square"></i>
              </span>
              <select
                className="form-select border-0 shadow-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Mobile">Mobile</option>
                <option value="Laptop">Laptop</option>
                <option value="Tv">Tv</option>
                <option value="Dress">Dress</option>
                <option value="Shoes">Shoes</option>
                <option value="Book">Book</option>
                <option value="Beauty">Beauty</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Watch">Watch</option>
              </select>
            </div>

            <div
              className="input-group input-group-sm"
              style={{ minWidth: "150px" }}
            >
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-sort-down"></i>
              </span>
              <select
                className="form-select border-0 shadow-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort</option>
                <option value="low">Low → High</option>
                <option value="high">High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <button
              className="btn btn-outline-secondary btn-sm rounded-pill shadow-sm"
              onClick={resetFilters}
            >
              <i className="bi bi-arrow-repeat"></i>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="container-fluid px-3 mt-4">
          <div className="row row-cols-2 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 g-3">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <ProductShimmer key={i} />
                ))
              : (filteredProducts.length === 0
                  ? product
                  : filteredProducts
                ).map((item, i) => (
                  <div className="col" key={i}>
                    <div className="card shadow-lg h-100 d-flex flex-column p-2">
                      <img
                        src={`data:image/jpeg;base64,${Buffer.from(
                          item.Thumbnail.data
                        ).toString("base64")}`}
                        className="card-img-top"
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/product/${item._id}`)}
                      />
                      <div className="card-body d-flex flex-column p-2">
                        <b className="card-title" style={{ fontSize: "14px" }}>
                          {item.Title}
                        </b>
                        <p className="mb-1">
                          <b>Price:</b> {item.Price} /-
                        </p>
                        <p className="mb-1">
                          <b>Rating:</b>{" "}
                          <span
                            style={{
                              color: "white",
                              backgroundColor:
                                item.Rating >= 4 ? "#28a745" : "#fd7e14",
                              padding: "2px 6px",
                              borderRadius: "12px",
                              fontSize: "12px",
                            }}
                          >
                            {item.Rating}{" "}
                            <i className="bi bi-star-fill ms-1"></i>
                          </span>
                        </p>
                        <button
                          className="btn mt-auto w-100"
                          style={{ backgroundColor: "red", color: "white" }}
                          onClick={() => {
                            if (!loginStatus.Status) {
                              setShowLoginModal(true);
                            } else {
                              addToCartFunction(item);
                              dispatch(
                                addItem({
                                  Title: item.Title,
                                  Price: item.Price,
                                  Category: item.Description,
                                  Rating: item.Rating,
                                  Thumbnail: `data:image/jpeg;base64,${Buffer.from(
                                    item.Thumbnail.data
                                  ).toString("base64")}`,
                                  Id: item._id,
                                })
                              );
                              toast(
                                <>
                                  <span style={{ marginRight: "50px" }}>
                                    1 item added
                                  </span>
                                  <b>
                                    VIEW CART <i className="bi bi-cart3"></i>
                                  </b>
                                </>,
                                {
                                  style: {
                                    color: "black",
                                    backgroundColor: "white",
                                  },
                                }
                              );
                            }
                          }}
                        >
                          Add to cart <i className="bi bi-cart4"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {registerForm ? "Sign Up" : "Login"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLoginModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {registerForm ? (
                  <Register setRegisterForm={setRegisterForm} />
                ) : (
                  <Login
                    loginStatus={loginStatus}
                    setLoginStatus={setLoginStatus}
                    accountDetails={accountDetails}
                    setAccountDetails={setAccountDetails}
                    setShowLoginModal={setShowLoginModal}
                    setRegisterForm={setRegisterForm}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        onClick={() => navigate("/cart")}
        position="bottom-right"
        autoClose={2500}
      />
      <Footer />
    </div>
  );
}

export default CustomerDashboard;
