import React, { useEffect, useState } from "react";
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
import { Heart } from "lucide-react";
import Loader from "./loader";

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

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://amazon-backend-k8m7.onrender.com/getProduct/${params}`)
      .then((res) => {
        const product = res?.data?.result;
        setProduct(product);

        axios
          .get("https://amazon-backend-k8m7.onrender.com/getProducts")
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
  }, [params]);

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
      .delete(`https://amazon-backend-k8m7.onrender.com/deleteProduct/${id}`)
      .then((res) => {
        if (res.data.success) {
          setPageReRender(!pageReRender);
          toast("Product Deleted Successfully", {
            style: { color: "black", backgroundColor: "white" },
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <div className="container mt-5">
      {/* <div className="text-center mb-5">
        <h2 style={{ color: "red", fontWeight: "bold" }}>Product Details</h2>
        <p style={{ color: "#555" }}>
          Explore this product and find more in the same category.
        </p>
      </div> */}

      <div className="row">
        {/* Product Image */}
        <div className="col-lg-6 mb-4">
          <div
            className="position-relative p-3 border rounded bg-white"
            style={{ minHeight: "320px" }}
          >
            {loading ? (
              <div>
                {" "}
                <div className="shimmer shimmer-img" />
                <Loader />
              </div>
            ) : productImage ? (
              <>
                <img
                  src={productImage}
                  className="img-fluid rounded w-100"
                  alt="product"
                  style={{ height: "300px", objectFit: "contain" }}
                />
                <button
                  className="btn btn-outline-danger position-absolute top-0 end-0 m-2 rounded-circle"
                  onClick={handleAddToWishlist}
                  title="Add to Wishlist"
                  style={{ width: "40px", height: "40px", padding: 0 }}
                >
                  <i className="bi bi-heart-fill"></i>
                </button>
              </>
            ) : (
              <div className="text-muted">Image not available</div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-6 mb-4">
          <div className="p-4 bg-white border border-danger rounded-4 shadow-sm">
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
                <h4 className="fw-bold text-danger">{product.Title}</h4>
                <h5 className="text-black-50 mb-3">₹ {product.Price}</h5>
                <p>
                  <strong>Category:</strong> {product.Category}
                </p>
                <p>
                  <strong>Description:</strong> {product.Description}
                </p>
                <p>
                  <strong>Rating:</strong>{" "}
                  <span
                    style={{
                      marginRight: "5px",
                      color: "white",
                      backgroundColor:
                        product?.Rating >= 4 ? "#28a745" : "#fd7e14",
                      padding: "2px 6px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {product?.Rating} <i className="bi bi-star-fill ms-1"></i>
                  </span>
                </p>
                <p className="text-success fw-semibold">✓ In Stock</p>
                <p>
                  <strong>Delivery:</strong> 3–5 business days
                </p>
                <p>
                  <strong>Warranty:</strong> 6 months
                </p>

                {loginStatus.Role == 1 ? (
                  <>
                    <button
                      type="button"
                      className="btn w-100"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete Product
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-danger w-100 my-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="bi bi-cart4 me-1"></i> Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-dark w-100"
                      onClick={handleAddToWishlist}
                    >
                      <i className="bi bi-heart me-1"></i> Add to Wishlist
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <hr className="my-5" />

      {/* Related Products Section */}
      <div className="mt-5">
        <h4 className="text-center text-danger mb-4">Related Products</h4>
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
                  <div className="card border border-dark h-100 shadow-sm">
                    <img
                      src={img}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "contain" }}
                      alt="related"
                      onClick={() => navigate(`/product/${item._id}`)}
                    />
                    <div className="card-body text-center">
                      <h6 className="card-title text-black">{item.Title}</h6>
                      <p className="card-text text-muted mb-2">
                        ₹ {item.Price}
                      </p>
                      <button
                        className="btn btn-outline-danger btn-sm w-100"
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
          <div className="text-muted mt-3 text-center">
            No related products available.
          </div>
        )}
      </div>

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
                <h5 className="modal-title text-danger">
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
    </div>
  );
}

export default ProductDetails;
