import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart, Menu } from "lucide-react";
import Login from "./login";
import Register from "./register";
import axios from "axios";
import blackNykee from "./Images/BLacknykee.png";
const categories = [
  "All",
  "Mobile",
  "Laptop",
  "Tv",
  "Dress",
  "Shoes",
  "Book",
  "Beauty",
  "Jewellery",
  "Watch",
];

const Header = ({
  loginStatus,
  setLoginStatus,
  product,
  filteredProducts,
  setFilteredProducts,
  setAccountDetails,
  accountDetails,
  showDropdown,
  setShowDropdown,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [registerForm, setRegisterForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [cartLength, setCartLength] = useState(Number);
  const navigate = useNavigate();
  console.log(cartLength);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = loginStatus.Status && loginStatus.Role === 1;
  const isCustomer = loginStatus.Status && loginStatus.Role === 0;

  const handleCategoryClick = (cat) => {
    if (cat === "All") {
      setFilteredProducts([]);
      navigate(isAdmin ? "/adminDashboard" : "/customerDashboard");
    } else {
      const filtered = product.filter((item) => item.Category === cat);
      setFilteredProducts(filtered);
      navigate(isAdmin ? "/adminDashboard" : "/customerDashboard");
    }
    setShowDropdown(false);
    setIsMenuOpen(false);
  };
  useEffect(() => {
    if (loginStatus.Id) {
      axios
        .get(`https://amazon-backend-k8m7.onrender.com/${loginStatus.Id}/cart`)
        .then((res) => {
          console.log(res?.data?.cartItems?.length);
          setCartLength(res?.data?.cartItems?.length);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  return (
    <header
      style={{ zIndex: "10000" }}
      className={`fixed top-0 w-100  bg-black shadow-sm py-2  position-fixed top-0  `}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* <h1
          className="m-0 fs-3 fw-bold text-white"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/");
            setShowDropdown(false);
          }}
        >
          Blacknykee
        </h1> */}
        <img
          onClick={() => {
            navigate("/");
            setShowDropdown(false);
          }}
          style={{ width: "210px", margin: "0px", cursor: "pointer" }}
          src={blackNykee}
        />

        <nav className="d-none d-md-flex gap-4 align-items-center">
          <span
            className="text-white fw-medium px-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
              setShowDropdown(false);
            }}
          >
            Home
          </span>
          <span
            style={{ cursor: "pointer" }}
            className="text-white fw-medium px-2 cursor-pointer"
            onClick={() => {
              navigate(isAdmin ? "/adminDashboard" : "/customerDashboard");
              setShowDropdown(false);
            }}
          >
            Catalog
          </span>

          <div className="position-relative">
            <span
              className="text-white fw-medium px-2"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ cursor: "pointer" }}
            >
              Collections
            </span>
            {showDropdown && (
              <div
                className="position-absolute mt-2 bg-white border rounded shadow p-3"
                style={{
                  zIndex: "",
                  minWidth: "200px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  background: "red",
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="text-dark fw-medium py-1 px-2 rounded"
                    style={{
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <span
              className="text-white fw-medium px-2"
              onClick={() => {
                navigate("/uploadProducts");
                setShowDropdown(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Sell Products
            </span>
          )}

          {isCustomer && (
            <span
              className="text-white fw-medium px-2"
              onClick={() => {
                navigate("/orders");
                setShowDropdown(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Returns & Orders
            </span>
          )}
          <span
            onClick={() => {
              setShowDropdown(false);
            }}
            className="text-white fw-medium px-2"
            style={{ cursor: "pointer" }}
          >
            Contact
          </span>
        </nav>

        <div className="d-flex align-items-center gap-3">
          {loginStatus.Status && (
            <i
              className="bi bi-person text-white fs-5"
              onClick={() => {
                if (loginStatus.Status == null) {
                  setShowLoginModal(true);
                } else if (loginStatus.Status == true) {
                  navigate("/account");
                }
              }}
              style={{ cursor: "pointer" }}
            />
          )}

          {isAdmin ? (
            ""
          ) : (
            <div
              onClick={() => {
                if (loginStatus.Status == null) {
                  setShowLoginModal(true);
                } else if (loginStatus.Status == true) {
                  navigate("/cart");
                }
              }}
              style={{ cursor: "pointer" }}
              className="position-relative"
            >
              <i
                className={`bi ${
                  cartLength > 0 ? "bi-cart-check-fill" : "bi-cart"
                } text-white fs-5`}
              />
              {cartLength > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartLength}
                </span>
              )}
            </div>
          )}

          {loginStatus.Status ? (
            <i
              className="bi bi-box-arrow-right text-white fs-5"
              title="Logout"
              style={{ cursor: "pointer" }}
              onClick={() => setShowLogoutModal(true)}
            />
          ) : (
            <i
              className="bi bi-box-arrow-in-right text-white fs-5"
              title="Login"
              style={{ cursor: "pointer" }}
              onClick={() => setShowLoginModal(true)}
            />
          )}

          <button
            className="d-md-none btn border-0 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container d-md-none py-3">
          <ul className="list-unstyled m-0">
            <li
              className="py-2 border-bottom border-secondary text-white"
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              Home
            </li>
            <li
              className="py-2 border-bottom border-secondary text-white"
              onClick={() => {
                navigate(isAdmin ? "/adminDashboard" : "/customerDashboard");
                setIsMenuOpen(false);
              }}
            >
              Catalog
            </li>
            <li className="py-2 border-bottom border-secondary text-white">
              <span
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setIsMenuOpen(false);
                }}
              >
                Collections
              </span>
              {showDropdown && (
                <ul className="ps-3 mt-2">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      className="text-white py-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        handleCategoryClick(cat);
                        setIsMenuOpen(false);
                      }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {isAdmin && (
              <li
                className="py-2 border-bottom border-secondary text-white"
                onClick={() => {
                  navigate("/uploadProducts");
                  setIsMenuOpen(false);
                  setIsMenuOpen(false);
                }}
              >
                Sell Products
              </li>
            )}
            {isCustomer && (
              <li
                className="py-2 border-bottom border-secondary text-white"
                onClick={() => {
                  navigate("/orders");
                  setIsMenuOpen(false);
                  setIsMenuOpen(false);
                }}
              >
                Returns & Orders
              </li>
            )}
            <li
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className="py-2 border-bottom border-secondary text-white"
            >
              Contact
            </li>
          </ul>
        </div>
      )}

      {/* Login Modal */}
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

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.21)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-light border-0">
                <h5 className="modal-title text-danger fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  Confirm Logout
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowLogoutModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="fs-5 mb-0">Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center gap-3">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={() => {
                    setLoginStatus([]);
                    setShowLogoutModal(false);
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
