import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

function Header({
  product,
  setProduct,
  filteredProducts,
  setFilteredProducts,
  loginStatus,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useSelector((state) => state.cartItems);
  const navigate = useNavigate();

  const categories = [
    "All",
    "Mobiles",
    "Laptop",
    "Tv",
    "Dress",
    "Shoe",
    "Book",
    "Beauty",
    "Jewellery",
    "Watch",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function applyFilter(category) {
    if (category === "All") {
      setFilteredProducts([]);
      return;
    }

    const result = product.filter((item) => item.Description === category);
    setFilteredProducts(result);
  }

  return (
    <header
      className={`fixed top-0 w-100 z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark shadow-sm py-2" : "bg-dark bg-opacity-80 py-3"
      }`}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <h1
          onClick={() =>
            loginStatus?.Role === 1
              ? navigate("/adminDashboard")
              : navigate("/customerDashboard")
          }
          style={{ color: "#ff3333", cursor: "pointer" }}
        >
          Blacknykee
        </h1>

        {/* Navigation for Desktop */}
        <nav className="d-none d-md-flex align-items-center gap-4">
          <a href="#" className="text-white text-decoration-none">
            Home
          </a>
          <a href="#" className="text-white text-decoration-none">
            Sell Products
          </a>

          {/* Bootstrap Dropdown for Collections */}
          <div className="dropdown">
            <button
              className="btn btn-dark dropdown-toggle"
              type="button"
              id="collectionsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Collections
            </button>
            <ul className="dropdown-menu" aria-labelledby="collectionsDropdown">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className="dropdown-item"
                    onClick={() => applyFilter(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <a href="#" className="text-white text-decoration-none">
            Orders
          </a>
          <a href="#" className="text-white text-decoration-none">
            Contact
          </a>
        </nav>

        {/* Icons */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <a href="#" className="text-white">
            <i className="bi bi-search"></i>
          </a>
          <a href="#" className="text-white">
            <i className="bi bi-person"></i>
          </a>
          <a href="#" className="text-white position-relative">
            <i className="bi bi-bag"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cartItems?.length || 0}
            </span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="d-md-none btn text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`container d-md-none transition-all ${
          isMenuOpen ? "d-block py-3" : "d-none"
        }`}
      >
        <ul className="list-unstyled">
          <li>
            <a href="#" className="text-white d-block py-2">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-white d-block py-2">
              Sell Products
            </a>
          </li>

          {/* Collections Dropdown in Mobile */}
          <li className="dropdown">
            <a
              className="dropdown-toggle text-white d-block py-2"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-expanded="false"
            >
              Collections
            </a>
            <ul className="dropdown-menu">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className="dropdown-item"
                    onClick={() => applyFilter(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <a href="#" className="text-white d-block py-2">
              Orders
            </a>
          </li>
          <li>
            <a href="#" className="text-white d-block py-2">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
