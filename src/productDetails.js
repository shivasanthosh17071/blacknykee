"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Buffer } from "buffer";
import { addItem, addFav } from "./reducer";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetails.css";
import Login from "./login";
import Register from "./register";
import Loader from "./loader";
import BASE_URL from "./config/api";

function ProductDetails({
  loginStatus,
  setLoginStatus,
  setAccountDetails,
  accountDetails,
}) {
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { params } = useParams();
  const [registerForm, setRegisterForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pageReRender, setPageReRender] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/getProduct/${params}`)
      .then((res) => {
        const product = res?.data?.result;
        setProduct(product);
        axios
          .get(`${BASE_URL}/getProducts`)
          .then((response) => {
            const filtered = response.data.result.filter(
              (p) => p.Category === product.Category && p._id !== product._id
            );
            setRelatedProducts(filtered.slice(0, 4));
            setLoading(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, [params, pageReRender]);

  const productImage = product?.Thumbnail?.data
    ? `data:image/jpeg;base64,${Buffer.from(product.Thumbnail.data).toString(
        "base64"
      )}`
    : null;

  function handleAddToCart(item) {
    if (loginStatus.Status == null) {
      setShowLoginModal(true);
    } else if (loginStatus.Status == true) {
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
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      dispatch(
        addItem({
          Title: product.Title,
          Price: product.Price,
          Category: product.Category,
          Rating: product.Rating,
          Thumbnail: productImage,
          Id: product._id,
        })
      );
      toast.success("Added to Cart 🛒", { position: "bottom-right" });
    }
  }

  const handleAddToWishlist = () => {
    if (loginStatus.Status == null) {
      setShowLoginModal(true);
    } else if (loginStatus.Status == true) {
      dispatch(
        addFav({
          Title: product.Title,
          Price: product.Price,
          Category: product.Category,
          Rating: product.Rating,
          Thumbnail: productImage,
          Id: product._id,
        })
      );
      toast.success("Added to Wishlist ", {
        position: "bottom-right",
      });
    }
  };

  function deleteProduct(id) {
    axios
      .delete(`${BASE_URL}/deleteProduct/${id}`)
      .then((res) => {
        if (res.data.success) {
          setPageReRender(!pageReRender);
          setShowConfirmModal(false);
          toast("Product Deleted Successfully", {
            style: { color: "black", backgroundColor: "white" },
          });
          navigate("/adminDashboard");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="container mt-5">
      <style>
        {`
          @keyframes fadeIn {
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
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          .shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200px 100%;
            animation: shimmer 1.5s infinite;
          }
          
          .shimmer-img {
            height: 300px;
            border-radius: 12px;
          }
          
          .shimmer-line {
            height: 20px;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          
          .shimmer-btn {
            height: 45px;
            border-radius: 8px;
          }
          
          .product-image-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            transition: all 0.3s ease;
          }
          
          .product-image-container:hover {
            border-color: #dc3545;
            box-shadow: 0 10px 30px rgba(220, 53, 69, 0.2);
          }
          
          .product-details-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid #dc3545;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.8s ease-out;
          }
          
          .btn-cart {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            border: none;
            transition: all 0.3s ease;
            border-radius: 10px;
          }
          
          .btn-cart:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(220, 53, 69, 0.4);
          }
          
          .btn-wishlist {
            border: 2px solid #6c757d;
            transition: all 0.3s ease;
            border-radius: 10px;
          }
          
          .btn-wishlist:hover {
            background: #6c757d;
            color: white;
            transform: translateY(-3px);
          }
          
          .btn-delete {
            background: linear-gradient(135deg, #000000 0%, #333333 100%);
            border: none;
            transition: all 0.3s ease;
            border-radius: 10px;
          }
          
          .btn-delete:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          }
          
          .wishlist-btn {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #dc3545;
            transition: all 0.3s ease;
          }
          
          .wishlist-btn:hover {
            background: #dc3545;
            color: white;
            animation: pulse 0.6s;
          }
          
          .rating-badge {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border-radius: 20px;
            padding: 6px 12px;
            font-weight: bold;
            color: white;
          }
          
          .rating-badge.warning {
            background: linear-gradient(135deg, #fd7e14 0%, #ffc107 100%);
          }
          
          .related-card {
            transition: all 0.3s ease;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .related-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
            border-color: #dc3545;
          }
          
          .related-card img {
            transition: transform 0.3s ease;
          }
          
          .related-card:hover img {
            transform: scale(1.1);
          }
          
          .shimmer-card {
            height: 300px;
            border-radius: 12px;
          }
        `}
      </style>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div
            className="position-relative p-4 product-image-container"
            style={{ minHeight: "320px" }}
          >
            {loading ? (
              <>
                <div className="shimmer shimmer-img" />
                <Loader />
              </>
            ) : productImage ? (
              <>
                <img
                  src={productImage || "/placeholder.svg"}
                  className="img-fluid rounded w-100"
                  alt="product"
                  style={{ height: "300px", objectFit: "contain" }}
                />
                <button
                  className="btn wishlist-btn position-absolute top-0 end-0 m-3 rounded-circle"
                  onClick={handleAddToWishlist}
                  title="Add to Wishlist"
                  style={{ width: "45px", height: "45px", padding: 0 }}
                >
                  <i className="bi bi-heart-fill"></i>
                </button>
              </>
            ) : (
              <div className="text-muted text-center">Image not available</div>
            )}
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="p-4 product-details-card">
            {loading ? (
              <>
                <div className="shimmer shimmer-line w-75 mb-3" />
                <div className="shimmer shimmer-line w-50 mb-3" />
                <div className="shimmer shimmer-line w-100 mb-3" />
                <div className="shimmer shimmer-line w-60 mb-2" />
                <div className="shimmer shimmer-btn w-50 mt-4" />
              </>
            ) : (
              <>
                <h4 className="fw-bold text-danger mb-3">{product.Title}</h4>
                <h5 className="text-success fw-bold mb-4">₹ {product.Price}</h5>
                <div className="mb-3">
                  <strong>Category:</strong>
                  <span className="badge bg-secondary ms-2">
                    {product.Category}
                  </span>
                </div>
                <div className="mb-3">
                  <strong>Description:</strong>
                  <p className="mt-2 text-muted">{product.Description}</p>
                </div>
                <div className="mb-3">
                  <strong>Rating:</strong>{" "}
                  <span
                    className={`rating-badge ms-2 ${
                      product?.Rating >= 4 ? "" : "warning"
                    }`}
                  >
                    {product?.Rating} <i className="bi bi-star-fill ms-1"></i>
                  </span>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <p className="text-success fw-semibold mb-0">
                      <i className="bi bi-check-circle me-1"></i>
                      In Stock
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="mb-0">
                      <strong>Delivery:</strong> 3–5 business days
                    </p>
                  </div>
                </div>
                <p className="mb-4">
                  <strong>Warranty:</strong> 6 months manufacturer warranty
                </p>

                {loginStatus.Role == 1 ? (
                  <button
                    style={{
                      background:
                        "linear-gradient(45deg,rgb(252, 0, 0),rgb(90, 14, 14))",
                    }}
                    type="button"
                    className="btn  text-white w-100 fw-bold py-3"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Delete Product
                  </button>
                ) : (
                  <div className="d-grid gap-2">
                    <button
                      style={{
                        background:
                          "linear-gradient(45deg,rgb(252, 0, 0),rgb(90, 14, 14))",
                      }}
                      className="btn border-o text-white fw-bold py-3"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="bi bi-cart4 me-2"></i> Add to Cart
                    </button>
                    <button
                      className="btn btn-wishlist fw-bold py-2"
                      onClick={handleAddToWishlist}
                    >
                      <i className="bi bi-heart me-2"></i> Add to Wishlist
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <hr
        className="my-5"
        style={{ border: "2px solid #dc3545", borderRadius: "2px" }}
      />

      <div className="mt-5">
        <h4 className="text-center text-danger mb-5 fw-bold">
          <i className="bi bi-grid me-2"></i>
          Related Products
        </h4>
        {loading ? (
          <div className="row">
            {[...Array(4)].map((_, i) => (
              <div className="col-md-3 mb-3" key={i}>
                <div className="shimmer shimmer-card rounded" />
              </div>
            ))}
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="row">
            {relatedProducts.map((item, index) => {
              const img = `data:image/jpeg;base64,${Buffer.from(
                item?.Thumbnail?.data
              ).toString("base64")}`;
              return (
                <div className="col-md-6 col-lg-3 mb-4" key={index}>
                  <div className="card related-card h-100 shadow-sm">
                    <div style={{ height: "180px", overflow: "hidden" }}>
                      <img
                        src={img || "/placeholder.svg"}
                        className="card-img-top w-100 h-100"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        alt="related"
                        onClick={() => navigate(`/product/${item._id}`)}
                      />
                    </div>
                    <div className="card-body text-center d-flex flex-column">
                      <h6 className="card-title text-dark fw-bold">
                        {item.Title}
                      </h6>
                      <p className="card-text text-danger fw-bold mb-2">
                        ₹ {item.Price}
                      </p>
                      <span
                        className={`rating-badge mb-3 ${
                          item.Rating >= 4 ? "" : "warning"
                        }`}
                      >
                        {item.Rating} <i className="bi bi-star-fill"></i>
                      </span>
                      <button
                        className="btn btn-outline-danger btn-sm mt-auto fw-bold"
                        onClick={() => navigate(`/product/${item._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted mt-5">
            <i className="bi bi-box-seam fs-1 mb-3 d-block"></i>
            <h5>No related products available</h5>
            <p>Check back later for more products in this category.</p>
          </div>
        )}
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
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  {registerForm ? "Sign Up" : "Login"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
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

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Confirm Deletion
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center">
                  <i className="bi bi-trash fs-1 text-danger mb-3"></i>
                  <p className="mb-0">
                    Are you sure you want to delete{" "}
                    <strong>{product.Title}</strong>?
                  </p>
                  <small className="text-muted">
                    This action cannot be undone.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteProduct(product._id)}
                >
                  <i className="bi bi-trash me-1"></i>
                  Yes, Delete
                </button>
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
    </div>
  );
}

export default ProductDetails;
