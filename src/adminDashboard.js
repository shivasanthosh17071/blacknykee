import axios from "axios";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { useDispatch, useSelector } from "react-redux";
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

function AdminDashboard({
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registerForm, setRegisterForm] = useState(false);
  const [pageReRender, setPageReRender] = useState(false);

  const isAdmin = loginStatus.Status && loginStatus.Role === 1;

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("https://amazon-backend-k8m7.onrender.com/getProducts")
      .then((res) => {
        setProduct(res.data.result);
        setFilteredProducts(res.data.result);
      });
  }, [pageReRender]);

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
  }, [searchTerm, selectedCategory, sortBy, product]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(product);
    } else if (selectedCategory !== "") {
      const filtered = product.filter(
        (item) => item.Category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory]);

  function resetFilters() {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("");
    setFilteredProducts(product);
  }

  function confirmDelete(id) {
    setProductToDelete(id);
    setDeleteModalVisible(true);
  }

  function handleDeleteConfirmed() {
    axios
      .delete(
        `https://amazon-backend-k8m7.onrender.com/deleteProduct/${productToDelete}`
      )
      .then((res) => {
        if (res.data.success) {
          setPageReRender((prev) => !prev);
          setDeleteModalVisible(false);
          toast(" Product Deleted!", {
            style: { color: "black", backgroundColor: "white" },
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div
      style={{ height: "auto" }}
      onClick={() => {
        setShowDropdown(false);
      }}
    >
      <div
        style={{}}
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
          <div class="carousel-item">
            <img src={banner5} class="d-block w-100" alt="..." />
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
          background: "red",
          position: "sticky",
          top: "72px",
          marginTop: "-50px",
          zIndex: "100",
          overflow: "scroll",
        }}
        className="container bg-white shadow-sm rounded-4 px-4 py-3  "
      >
        <div className="row gy-2 gx-3 align-items-center">
          {/* Search Bar */}
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className=" form-control border-0 shadow-sm"
                id="search-bar"
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
          <div className="col-12 col-md-2 d-grid">
            <button
              className="btn btn-outline-secondary rounded-pill shadow-sm"
              onClick={resetFilters}
            >
              <i className="bi bi-arrow-repeat me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container-fluid px-3 mt-4">
        <div className="row row-cols-2 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 g-3">
          {(filteredProducts.length === 0 ? product : filteredProducts).map(
            (item, i) => (
              <div className="col" key={i}>
                <div className="card shadow-lg border-light rounded h-100 p-2">
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
                    alt="Product"
                  />
                  <div className="card-body d-flex flex-column justify-content-between p-2">
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
                            item?.Rating >= 4 ? "#28a745" : "#fd7e14",
                          padding: "2px 6px",
                          borderRadius: "12px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {item?.Rating} <i className="bi bi-star-fill ms-1"></i>
                      </span>
                    </p>
                    {/* <p className="mb-1">
                      <b>Category:</b> {item.Description}
                    </p> */}
                    <button
                      className="btn mt-auto w-100 "
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      onClick={() => confirmDelete(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this product?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteModalVisible(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteConfirmed}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <ToastContainer position="bottom-right" autoClose={2000} />

      {<Footer />}
    </div>
  );
}

export default AdminDashboard;
