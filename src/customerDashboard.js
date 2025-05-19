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
function CustomerDashboard({
  filteredProducts,
  setFilteredProducts,
  product,
  setProduct,
  loginStatus,
  setLoginStatus,
  setAccountDetails,
  accountDetails,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addCartProduct, setAddCartProduct] = useState({});
  const cartItems = useSelector((state) => state.cartItems);
  const [registerForm, setRegisterForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const isAdmin = loginStatus.Status && loginStatus.Role === 1;
  const isCustomer = loginStatus.Status && loginStatus.Role === 0;

  useEffect(() => {
    axios
      .get("https://amazon-backend-k8m7.onrender.com/getProducts")
      .then((res) => {
        setProduct(res.data.result);
        setFilteredProducts(res.data.result);
      });
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

  function resetFilters() {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("");
    setFilteredProducts(product);
  }
  useEffect(() => {
    console.log(selectedCategory);
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

  function addToCartFunction(item) {
    axios
      .post(
        `https://amazon-backend-k8m7.onrender.com/${loginStatus.Id}/addToCart`,
        {
          Title: item.Title,
          Price: item.Price,
          Category: item.Description,
          Rating: item.Rating,
          Thumbnail: `data:image/jpeg;base64,${Buffer.from(
            item.Thumbnail.data
          ).toString("base64")}`,
          Id: item._id,
        }
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))",
        }}
      >
        <div
          style={{ height: "", overflow: "" }}
          id="carouselExampleAutoplaying"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src={banner1} class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src={banner2} class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src={banner3} class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src={banner4} class="d-block w-100" alt="..." />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <div
          style={{
            height: "70px",
            background: "red",
            position: "sticky",
            top: "55px",
            marginTop: "-50px",
            zIndex: "1000",
            overflow: "scroll",
          }}
          className="container bg-white shadow-sm rounded-4 px-4 py-3    "
        >
          <div className="row gy-2 gx-3 align-items-center ">
            {/* Search Bar */}
            <div className="col-12 col-md-4" id="search-bar">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-sm"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-6 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-filter-square"></i>
                </span>
                <select
                  className="form-select border-0 shadow-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tv">Tv</option>
                  <option value="Dress"> Dress</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Book">Book</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Watch">Watch</option>
                </select>
              </div>
            </div>

            {/* Sort By */}
            <div className="col-6 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-sort-down"></i>
                </span>
                <select
                  className="form-select border-0 shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort by</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Reset Filters Button */}
            <div className="col-12 col-md-2 d-grid " style={{}}>
              <button
                className="btn btn-outline-secondary rounded-pill shadow-sm"
                onClick={resetFilters}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Reset
              </button>
            </div>
          </div>
        </div>
        {/* <br /> */}
        <div className="container-fluid px-3 mt-4">
          <div className="row row-cols-2 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 g-3">
            {(filteredProducts.length === 0 ? product : filteredProducts).map(
              (item, i) => (
                <div className="col" key={i}>
                  <div
                    className="card product-card shadow-lg border-light rounded h-100 d-flex flex-column"
                    style={{ border: "none", padding: "10px" }}
                  >
                    <img
                      src={`data:image/jpeg;base64,${Buffer.from(
                        item.Thumbnail.data
                      ).toString("base64")}`}
                      className="card-img-top product-img"
                      alt="Product"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate(`/product/${item._id}`);
                      }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between p-2 flex-grow-1">
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
                            marginRight: "5px",
                            color: "white",
                            backgroundColor:
                              item?.Rating >= 4 ? "#28a745" : "#fd7e14",
                            padding: "2px 6px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            fontSize: "12px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {item?.Rating}{" "}
                          <i className="bi bi-star-fill ms-1"></i>
                        </span>
                      </p>
                      {filteredProducts.length !== 0 && (
                        <p className="mb-1">
                          {/* <b>Category:</b> {item.Description} */}
                        </p>
                      )}
                      <button
                        type="button"
                        className="btn mt-auto w-100"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: "5px",
                          padding: "8px 0",
                        }}
                        onClick={() => {
                          if (loginStatus.Status == null) {
                            setShowLoginModal(true);
                          } else if (loginStatus.Status == true) {
                            if (filteredProducts.length === 0) {
                              addToCartFunction(item);
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
                            }
                            toast(
                              <>
                                <span style={{ marginRight: "50px" }}>
                                  1 item added
                                </span>{" "}
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
                        Add to cart<i className="bi bi-cart4"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
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
        onClick={() => {
          navigate("/cart");
        }}
        position="bottom-right"
        autoClose={2500}
      />

      {loginStatus?.Status === true && <Footer />}
    </>
  );
}

export default CustomerDashboard;
