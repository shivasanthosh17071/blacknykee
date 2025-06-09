import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./config/api";
import { Heart, Trash2, ShoppingCart, RefreshCw } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishList, setWishList] = useState([]);
  const [pageStatus, setPageStatus] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  useEffect(() => {
    const accountDetails = JSON.parse(sessionStorage.getItem("accountDetails"));
    if (!accountDetails?._id) return;
    axios
      .get(`${BASE_URL}/getWishlist/${accountDetails._id}`)
      .then((res) => {
        setWishList(res.data.wishList);
      })
      .catch(() => {
        showToast("Failed to load wishlist.", "error");
      });
  }, [pageStatus]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  }

  function handleDeleteWishlist(productId) {
    const accountDetails = JSON.parse(sessionStorage.getItem("accountDetails"));
    const userId = accountDetails?._id;
    axios
      .delete(`${BASE_URL}/deleteWishlist/${userId}/${productId}`)
      .then(() => {
        showToast("Item removed from wishlist.", "success");
        setPageStatus(!pageStatus);
      })
      .catch(() => {
        showToast("Error removing item.", "error");
      });
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          <Heart color="red" fill="red" size={28} className="me-2" />
          Your Wishlist
        </h2>
        <p className="text-muted">All your saved favorites in one place.</p>
      </div>

      {wishList.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Empty Wishlist"
            style={{ width: "140px", opacity: 0.7 }}
          />
          <p className="mt-3 lead text-muted">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="row g-4">
          {wishList.map((item) => (
            <div className="col-sm-6 col-lg-4" key={item.ProductId}>
              <div
                className="card shadow-sm border-0 h-100 d-flex flex-column"
                style={{ borderRadius: "16px", overflow: "hidden" }}
              >
                <img
                  src={item.Thumbnail}
                  alt={item.Title}
                  className="card-img-top"
                  style={{
                    height: "220px",
                    objectFit: "cover",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5
                    className="card-title text-truncate mb-2"
                    title={item.Title}
                  >
                    {item.Title}
                  </h5>
                  <p className="text-danger fw-bold mb-3">₹ {item.Price}</p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between">
                      <button
                        style={{
                          background:
                            "linear-gradient(45deg,rgb(252, 0, 0),rgb(90, 14, 14))",
                        }}
                        className="btn text-light btn-sm w-48"
                        onClick={() => handleDeleteWishlist(item.ProductId)}
                      >
                        <Trash2 size={16} className="me-1" />
                        Remove
                      </button>
                      <button
                        className="btn btn-outline-info  btn-sm w-48"
                        onClick={() => navigate(`/product/${item.ProductId}`)}
                      >
                        {/* <ShoppingCart size={16} className="me-1" /> */}
                        Check Details{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {toast.message && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: toast.type === "success" ? "#28a745" : "#dc3545",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
            minWidth: "220px",
            fontWeight: "500",
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
