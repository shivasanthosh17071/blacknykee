"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

export default function Home({ loginStatus }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = loginStatus.Status && loginStatus.Role === 1;
  const isCustomer = loginStatus.Status && loginStatus.Role === 0;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const reasons = [
    {
      title: "Curated Quality",
      description: "Handpicked stylish and durable products",
      icon: "bi-award",
    },
    {
      title: "Fast Delivery",
      description: "Reliable and timely shipping service",
      icon: "bi-truck",
    },
    {
      title: "Secure Payments",
      description: "Multiple safe payment options",
      icon: "bi-shield-lock",
    },
    {
      title: "Customer First",
      description: "24/7 support and easy returns policy",
      icon: "bi-headset",
    },
  ];

  const collections = [
    {
      title: "Fashion & Accessories",
      image:
        "https://imgs.search.brave.com/-ACU45_1QowmlTumCjkSuyGhCYq32WxDzT_22JnQ9Fk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI3/MjU1NDAzMS9waG90/by90b3Atdmlldy1v/Zi13b21lbnMtYWNj/ZXNzb3JpZXMtb24t/cGluay1iYWNrZ3Jv/dW5kLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1fX09wM0Y2/c1drYUpBMG90MUFP/b292Rzcwc0lMUXQ4/T2g0R2dDS1RMMkFv/PQ",
      link: "/customerDashboard",
    },
    {
      title: "Electronics & Gadgets",
      image:
        "https://imgs.search.brave.com/VZkucVN27QJQ2Ua2i81eF6EjN7hUoRoZM_cqZcXkOZI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9nYWRnZXRzLXRl/Y2gtZGV2aWNlc181/MDIxMDYtMTM0OC5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw",
      link: "/customerDashboard",
    },
    {
      title: "Shoes & Foot wear",
      image:
        "https://imgs.search.brave.com/rKevpMMKmJctb7lwFIHfvAMg4G51EAlwwDFqUmWywT0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE1/MjUyNzI4Ni9waG90/by9ib3V0aXF1ZS1z/aG9lcy1pbi1hLXN0/b3JlLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz0tXzhudkJt/OVVySlc2NW1aeFJP/aDdOejZCZlpFazdB/UG5mZnpyTlJ3Z2tR/PQ",
      link: "/customerDashboard",
    },
    {
      title: "Beauty & Wellness",
      image:
        "https://imgs.search.brave.com/GTTUV4rGIz4qJgrfMj9028prwON-WzpPTPpopBv6sDs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzY0LzA0LzA5/LzM2MF9GXzE2NDA0/MDkwM19wWVBlc0hK/R3VJUmdlNGVSU1I1/VUVZS2ZiYWEwdUk2/Wi5qcGc",
      link: "/customerDashboard",
    },
    {
      title: "Mens & Womens",
      image:
        "https://imgs.search.brave.com/94LEySUVVIvGav_a4kgqyr5pKHEVWQ4PtaKKnK1XQ3g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/Y2xvdGhlcy1vbi1h/LXJhY2staW4tYS1j/bG90aGluZy1zdG9y/ZS5qcGc_d2lkdGg9/MTAwMCZmb3JtYXQ9/cGpwZyZleGlmPTAm/aXB0Yz0w",
      link: "/customerDashboard",
    },
  ];

  const steps = [
    {
      title: "Browse",
      description: "Explore our wide range of products",
      icon: "bi-search",
    },
    {
      title: "Select",
      description: "Choose items that match your style",
      icon: "bi-hand-index-thumb",
    },
    {
      title: "Checkout",
      description: "Secure and easy payment process",
      icon: "bi-credit-card",
    },
    {
      title: "Track",
      description: "Follow your order in real-time",
      icon: "bi-geo-alt",
    },
    {
      title: "Enjoy",
      description: "Receive and enjoy your premium products",
      icon: "bi-emoji-smile",
    },
  ];

  return (
    <div style={{ color: "white" }}>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
          }
          
          .animate-slideInLeft {
            animation: slideInLeft 0.8s ease-out;
          }
          
          .animate-slideInRight {
            animation: slideInRight 0.8s ease-out;
          }
          
          .animate-pulse {
            animation: pulse 2s infinite;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .hero-btn {
            background: linear-gradient(90deg,rgb(137, 16, 16),rgb(255, 0, 0));
            border: none;
            transition: all 0.8s ease;
            box-shadow: 0 4px 15px rgba(255, 51, 51, 0.3);
          }
          
          .hero-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(255, 51, 51, 0.4);
            background: linear-gradient(45deg,rgb(0, 0, 0),rgb(252, 0, 0));
          }
          
          .feature-card {
            transition: all 0.3s ease;
            background: linear-gradient(45deg,rgb(255, 0, 0),rgb(0, 0, 0));
            border: 1px solid #333;
           
          }
          
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(255, 51, 51, 0.2);
            border-color: #ff3333;
          }
          
          .collection-card {
            transition: all 0.4s ease;
            overflow: hidden;
            border-radius: 15px;
          }
          
          .collection-card:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          .collection-card img {
            transition: transform 0.4s ease;
          }
          
          .collection-card:hover img {
            transform: scale(1.1);
          }
          
          .step-circle {
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
          }
          
          .step-circle:hover {
            transform: scale(1.1);
            background: linear-gradient(135deg, #ff3333 0%,rgba(255, 0, 0, 0.84) 100%);
          }
          
          .contact-form {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 1px solid #333;
          }
          
          .form-control:focus {
            border-color: #ff3333;
            box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.78);
          }
          
          .section-title {
            position: relative;
            display: inline-block;
          }
          
          .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 3px;
            background: linear-gradient(45deg,rgb(0, 0, 0),rgb(255, 0, 0));
            border-radius: 2px;
          }
        `}
      </style>

      <section
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,rgb(0, 0, 0) 50%,rgb(255, 0, 0) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "0",
        }}
      >
        <div className="container text-center py-5">
          <h1
            className="display-3 fw-bold mb-3 animate-fadeInUp"
            style={{ color: "#ffffff" }}
          >
            Welcome to <span style={{ color: "#ff3333" }}>Blacknykee</span> —
            Shop Bold. Shop Smart.
          </h1>
          <p
            className="fs-5 mb-5 mx-auto animate-fadeInUp"
            style={{ maxWidth: "800px", animationDelay: "0.s" }}
          >
            Experience premium quality products, unbeatable deals, and a smooth
            shopping experience that puts you first.
          </p>
          <button
            className="btn btn-lg fw-bold px-5 py-3 rounded-pill hero-btn animate-pulse"
            style={{ animationDelay: "0.6s" }}
            onClick={() =>
              navigate(isAdmin ? "/adminDashboard" : "/customerDashboard")
            }
          >
            SHOP BOLD
          </button>
        </div>
      </section>

      <section
        className="py-5 text-white"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <div className="container py-5">
          <h2 className="text-center text-black mb-5 fw-bold section-title animate-fadeInUp">
            Why Shop with <span style={{ color: "#ff3333" }}>Blacknykee</span>?
          </h2>

          <div className="row g-4 text-white">
            {reasons.map((reason, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div
                  className="card  h-100 border-0 text-center p-4 feature-card animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="card-body d-flex flex-column align-items-center">
                    <i
                      className={`bi ${reason.icon} fs-1 mb-3 animate-float`}
                      style={{
                        color: "#ff3333",
                        animationDelay: `${index * 0.5}s`,
                      }}
                    ></i>
                    <h3 className="fs-5 fw-bold mb-2 text-white">
                      {reason.title}
                    </h3>
                    <p className="text-secondary text-black mb-0">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        <div className="container py-5">
          <h2
            className="text-center mb-5 fw-bold section-title animate-fadeInUp"
            style={{ color: "red" }}
          >
            Featured Collections -
            <span className="text-black"> explore our curated picks !</span>
          </h2>

          <div className="row g-4">
            {collections.map((collection, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 rounded-3 overflow-hidden position-relative collection-card animate-slideInLeft"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <img
                    src={collection.image || "/placeholder.svg"}
                    className="card-img"
                    alt={collection.title}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <div
                    className="card-img-overlay d-flex align-items-end"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    }}
                  >
                    <div className="w-100">
                      <h3 className="text-white fs-5 fw-bold mb-3">
                        {collection.title}
                      </h3>
                      <span
                        className="btn btn-sm rounded-pill"
                        style={{
                          background:
                            "linear-gradient(45deg,rgb(0, 0, 0),rgb(255, 0, 0))",
                          color: "white",
                          border: "none",
                          transition: "all 0.3s ease",
                        }}
                        onClick={() => navigate(collection.link)}
                      >
                        Shop Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #111111 0%, #1a1a1a 100%)",
        }}
      >
        <div className="container py-5">
          <h2
            className="text-center mb-5 fw-bold section-title animate-fadeInUp"
            style={{ color: "white" }}
          >
            How It Works
          </h2>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="d-flex flex-column flex-md-row justify-content-between position-relative">
                <div
                  className="position-absolute d-none d-md-block"
                  style={{
                    top: "40px",
                    left: "60px",
                    right: "60px",
                    height: "2px",
                    background:
                      "linear-gradient(90deg, #333333,rgb(255, 0, 0), #333333)",
                    zIndex: 0,
                  }}
                ></div>

                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="d-flex flex-column align-items-center text-center mb-4 mb-md-0 position-relative animate-fadeInUp"
                    style={{ zIndex: 1, animationDelay: `${index * 0.2}s` }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-3 step-circle"
                      style={{
                        width: "80px",
                        height: "80px",
                        border: " 2px solid rgb(255, 255, 255)",
                      }}
                    >
                      <i
                        className={`bi ${step.icon} fs-3`}
                        style={{ color: "rgb(255, 255, 255)" }}
                      ></i>
                    </div>
                    <h3 className="fs-5 fw-bold mb-1">{step.title}</h3>
                    <p
                      className="small text-secondary"
                      style={{ maxWidth: "120px" }}
                    >
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 animate-slideInLeft">
              <h2 className="fw-bold mb-4 section-title">We're Here For You</h2>
              <p className="mb-4">
                Our dedicated customer support team is available 24/7 to assist
                you with any questions, concerns, or issues you may have. We're
                committed to providing exceptional service and ensuring your
                shopping experience is smooth and enjoyable.
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center">
                  <i
                    className="bi bi-envelope fs-4 me-3"
                    style={{ color: "#ff3333" }}
                  ></i>
                  <div>
                    <p className="fw-bold mb-0">Email Us</p>
                    <p className="mb-0">support@blacknykee.com</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <i
                    className="bi bi-telephone fs-4 me-3"
                    style={{ color: "#ff3333" }}
                  ></i>
                  <div>
                    <p className="fw-bold mb-0">Call Us</p>
                    <p className="mb-0">+91 9182868227</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <i
                    className="bi bi-chat-dots fs-4 me-3"
                    style={{ color: "#ff3333" }}
                  ></i>
                  <div>
                    <p className="fw-bold mb-0">Live Chat</p>
                    <p className="mb-0">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 animate-slideInRight">
              <div className="card border-0 rounded-3 overflow-hidden contact-form">
                <div className="card-body p-4">
                  <h3 className="fs-5 fw-bold mb-4 text-white">
                    Send Us a Message
                  </h3>
                  <form>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control bg-dark border-0 text-white"
                        placeholder="Your Name"
                        style={{
                          padding: "12px 15px",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control bg-dark border-0 text-white"
                        placeholder="Your Email"
                        style={{ padding: "12px 15px", borderRadius: "8px" }}
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control bg-dark border-0 text-white"
                        rows={4}
                        placeholder="Your Message"
                        style={{ padding: "12px 15px", borderRadius: "8px" }}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="btn w-100 feature-card"
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
