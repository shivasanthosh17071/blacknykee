import axios from "axios";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { useDispatch } from "react-redux";
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
      <div className="card shadow-sm border-light p-3 product-card">
        <div
          className="mb-3 shimmer"
          style={{ height: "180px", borderRadius: "8px" }}
        ></div>
        <div
          className="shimmer mb-2"
          style={{ height: "16px", width: "80%" }}
        ></div>
        <div
          className="shimmer mb-2"
          style={{ height: "14px", width: "60%" }}
        ></div>
        <div
          className="shimmer mb-2"
          style={{ height: "14px", width: "50%" }}
        ></div>
        <div
          className="shimmer"
          style={{ height: "38px", width: "100%" }}
        ></div>
      </div>
    </div>
  );

  return (
    <div onClick={() => setShowDropdown(false)}>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: calc(200px + 100%) 0;
            }
          }
          
          .shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200px 100%;
            animation: shimmer 1.5s infinite;
          }
          
          .product-card {
            transition: all 0.3s ease;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            border-color: #dc3545;
          }
          
          .product-image {
            transition: transform 0.3s ease;
          }
          
          .product-card:hover .product-image {
            transform: scale(1.05);
          }
          
          .filter-container {
            background: white ;
            // border-bottom: 3px solid #dc3545;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          
          .filter-input {
            border: 2px solid transparent;
            transition: all 0.3s ease;
            border-radius: 8px;
          }
          
          .filter-input:focus {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
          }
           
          @media (max-width: 480px) {
         .filter{
         display:flex;
         flex-direction: column;
         margin:0px;
         padding:0px
         }
          }
          .btn-remove {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            border: none;
            transition: all 0.3s ease;
          }
          
          .btn-remove:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
          }
          
          .carousel-item img {
            border-radius: 0 0 15px 15px;
          }
          
          .rating-badge {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border-radius: 20px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: bold;
          }
          
          .rating-badge.warning {
            background: linear-gradient(135deg, #fd7e14 0%, #ffc107 100%);
          }
        `}
      </style>

      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
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
                <img
                  src={img || "/placeholder.svg"}
                  className="d-block w-100"
                  alt="banner"
                />
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

        {/* Filters divison */}
        <div
          className="filter-container"
          style={{
            display: "flex",
            position: "sticky",
            top: "64px",
            zIndex: "100",
            overflowX: "auto",
            background: "",
          }}
        >
          {/* offers */}
          <div
            className=" filter d-flex justify-content-end  gap-3 px-4 py-3 w-100"
            style={{}}
          >
            <div className="filter1 d-flex ">
              {" "}
              <div
                className="input-group input-group-sm"
                style={{ minWidth: "200px" }}
              >
                <span className="input-group-text bg-white border-0">
                  <i className="bi bi-search text-danger"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-sm filter-input"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-outline-danger btn-sm rounded-pill  shadow-sm"
                style={{ marginLeft: "6px" }}
              >
                <i
                  onClick={resetFilters}
                  className="bi bi-arrow-repeat me-1"
                ></i>
              </button>
            </div>
            <div className="filter2 d-flex">
              <div
                className="input-group input-group-sm"
                style={{ minWidth: "160px" }}
              >
                <span className="input-group-text bg-white border-0">
                  <i className="bi bi-filter-square text-danger"></i>
                </span>
                <select
                  className="form-select border-0 shadow-sm filter-input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tv">TV</option>
                  <option value="Dress">Dress</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Book">Book</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Watch">Watch</option>
                </select>
              </div>{" "}
              <div
                className="input-group input-group-sm"
                style={{ minWidth: "160px" }}
              >
                <span className="input-group-text bg-white border-0">
                  <i className="bi bi-sort-down text-danger"></i>
                </span>
                <select
                  className="form-select border-0 shadow-sm filter-input"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort by Price</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="container-fluid px-4 mt-4">
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-4">
            {loading
              ? [...Array(12)].map((_, i) => (
                  <div className="col" key={i}>
                    <div className="card shadow-sm border-light rounded h-100 p-3">
                      <div
                        className="shimmer mb-3"
                        style={{ height: "180px", borderRadius: "8px" }}
                      ></div>
                      <div
                        className="shimmer mb-2"
                        style={{ height: "20px" }}
                      ></div>
                      <div
                        className="shimmer mb-2"
                        style={{ height: "15px", width: "60%" }}
                      ></div>
                      <div
                        className="shimmer"
                        style={{ height: "15px", width: "40%" }}
                      ></div>
                    </div>
                  </div>
                ))
              : (filteredProducts.length === 0
                  ? product
                  : filteredProducts
                ).map((item, i) => (
                  <div
                    className="col"
                    key={i}
                    style={{
                      animation: `slideIn 0.5s ease-out ${i * 0.1}s both`,
                    }}
                  >
                    <div className="card product-card shadow-sm h-100 p-3">
                      <img
                        src={`data:image/jpeg;base64,${Buffer.from(
                          item.Thumbnail.data
                        ).toString("base64")}`}
                        className="card-img-top product-image"
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          cursor: "pointer",
                          borderRadius: "8px",
                        }}
                        onClick={() => navigate(`/product/${item._id}`)}
                        alt="Product"
                      />
                      <div className="card-body d-flex flex-column justify-content-between p-2 mt-2">
                        <h6
                          className="card-title fw-bold"
                          style={{ fontSize: "14px", color: "#333" }}
                        >
                          {item.Title}
                        </h6>
                        <p className="mb-2 fw-bold text-danger">
                          ₹{item.Price}
                        </p>
                        <p className="mb-2">
                          <span
                            className={`rating-badge text-white ${
                              item?.Rating >= 4 ? "" : "warning"
                            }`}
                          >
                            {item?.Rating}{" "}
                            <i className="bi bi-star-fill ms-1"></i>
                          </span>
                        </p>

                        <button
                          style={{
                            color: "white",
                            background:
                              "linear-gradient(45deg,rgb(252, 0, 0),rgb(90, 14, 14))",
                          }}
                          className="btn border-0 text-white mt-auto w-100 fw-bold"
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
                          <i className="bi bi-cart4 me-1"></i>
                          Add to cart
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
          className="modal fade show d-block mt-4"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header ">
                <h5 className="modal-title">
                  {registerForm ? "Sign Up" : "Login"}
                </h5>
                <button
                  type="button"
                  className="btn-close "
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
