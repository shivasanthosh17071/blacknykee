import React from "react";
import "./App.css";
import { NavLink, useNavigate } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();
  return (
    <>
      <footer className="pt-5 pb-4" style={{ backgroundColor: "#121212" }}>
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h3 className="fs-4 fw-bold mb-4" style={{ color: "#e63946" }}>
                Blacknykee
              </h3>
              <p className="mb-4 text-light">
                Premium quality products for those who demand the best. Shop
                with confidence and style.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="text-light fs-5">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-light fs-5">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-light fs-5">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-light fs-5">
                  <i className="bi bi-pinterest"></i>
                </a>
              </div>
            </div>

            {/** Footer Columns */}
            {[
              {
                title: "Shop",
                links: ["New Arrivals", "Best Sellers", "Sale", "Collections"],
              },
              {
                title: "Support",
                links: ["Contact Us", "FAQs", "Shipping", "Returns"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Affiliates"],
              },
              {
                title: "Legal",
                links: [
                  "Privacy Policy",
                  "Terms & Conditions",
                  "Return Policy",
                  "Accessibility",
                ],
              },
            ].map((section, index) => (
              <div key={index} className="col-6 col-sm-6 col-lg-2">
                <h5 className="fs-6 fw-bold mb-3 text-white">
                  {section.title}
                </h5>
                <ul className="list-unstyled">
                  {section.links.map((link, idx) => (
                    <li key={idx} className="mb-2 ">
                      <a
                        href="#"
                        className=" text-decoration-none hover-text-light text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="border-secondary my-4" />

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <p className="text-white mb-3 mb-md-0">
              © 2025 Blacknykee. All rights reserved.
            </p>
            {/* <div className="d-flex gap-3">
              <img src="/img/visa.svg" alt="Visa" height="30" width="50" />
              <img
                src="/img/mastercard.svg"
                alt="Mastercard"
                height="30"
                width="50"
              />
              <img src="/img/paypal.svg" alt="PayPal" height="30" width="50" />
              <img
                src="/img/applepay.svg"
                alt="Apple Pay"
                height="30"
                width="50"
              />
            </div> */}
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer;
