"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearCart } from "./reducer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressForm from "./addressForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AlertCircle, Minus, Plus, Star, CheckCircle } from "lucide-react";
import BASE_URL from "./config/api";

function Cart({ loginStatus, accountDetails }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiID, setUpiID] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/${loginStatus.Id}/cart`)
      .then((res) => {
        console.log(res);
        setCartItems(res.data.cartItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [loginStatus.Id]);

  const groupedCartItems = cartItems.reduce((acc, item) => {
    const key = item.ProductId || item.Id;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 1 };
    } else {
      acc[key].quantity += 1;
    }
    return acc;
  }, {});

  const groupedItemsArray = Object.values(groupedCartItems);
  const totalPrice = groupedItemsArray.reduce(
    (acc, item) => acc + item.Price * item.Quantity,
    0
  );

  const handleDecrement = (item) => {
    axios
      .put(`${BASE_URL}/decreaseQuantity/${loginStatus.Id}/${item.ProductId}`)
      .then((res) => {
        setCartItems(res.data.cartItems);
        toast.info("Item quantity decreased");
      })
      .catch((err) => console.log(err));
  };

  const handleIncrement = (item) => {
    axios
      .put(`${BASE_URL}/increaseQuantity/${loginStatus.Id}/${item.ProductId}`)
      .then((res) => {
        setCartItems(res.data.cartItems);
        toast.success("Item quantity increased");
      })
      .catch((err) => console.log(err));
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === "UPI") {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(upiID)) {
        toast.error("Invalid UPI ID");
        return;
      }
    }
    setPaymentSuccess(true);
    setShowPaymentModal(false);
    toast.success(
      paymentMethod === "UPI"
        ? "Payment successful via UPI"
        : "Cash on Delivery selected"
    );
  };

  const handleOrderNow = async () => {
    const orderData = {
      customerId: accountDetails.Email,
      status: "Confirmed",
      paymentMethod: paymentMethod,
      totalAmount: totalPrice,
      address: address,
      items: groupedItemsArray.map((item) => ({
        Title: item.Title,
        Price: item.Price,
        Quantity: item.Quantity,
        Thumbnail: item.Thumbnail,
        ProductId: item?.ProductId,
      })),
    };
    try {
      await axios
        .post(`${BASE_URL}/${loginStatus.Id}/order`, orderData)
        .then((res) => {
          console.log(res);
        });
      toast.success("Order placed successfully");
      dispatch(clearCart());
      setShowConfirmModal(false);
      setOrderPlaced(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="container py-4 mt-3">
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
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          // @keyframes bounce {
          //   0%, 20%, 50%, 80%, 100% {
          //     transform: translateY(0);
          //   }
          //   40% {
          //     transform: translateY(-10px);
          //   }
          //   60% {
          //     transform: translateY(-5px);
          //   }
          // }
          
          .cart-item {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 1px solid #e0e0e0;
            border-radius: 15px;
            transition: all 0.3s ease;
            animation: slideIn 0.5s ease-out;
          }
          
          .cart-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            border-color: #dc3545;
          }
          
          .cart-image {
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            transition: all 0.3s ease;
          }
          
          // .cart-image:hover {
          //   border-color: #dc3545;
          //   transform: scale(1.05);
          // }
          
          .quantity-btn {
            width: 35px;
            height: 35px;
            // border-radius: 50%;
            border: 2px solid;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          // .quantity-btn:hover {
          //   transform: scale(1.1);
          //   animation: bounce 0.6s;
          // }
          
          .order-summary {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid #dc3545;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 100px;
          }
          
          .btn-payment {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
            border: none;
            transition: all 0.3s ease;
            border-radius: 10px;
          }
          
          .btn-payment:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(108, 117, 125, 0.4);
          }
          
          .btn-order {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            border: none;
            transition: all 0.3s ease;
            border-radius: 10px;
          }
          
          .btn-order:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(220, 53, 69, 0.4);
          }
          
          .empty-cart {
            animation: fadeIn 1s ease-out;
            text-align: center;
            padding: 60px 20px;
          }
          
          .empty-cart img {
            transition: transform 0.3s ease;
          }
          
          .empty-cart img:hover {
            transform: scale(1.1);
          }
          
          .modal-content {
            border: none;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }
          
          .rating-display {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border-radius: 15px;
            padding: 4px 8px;
            color: white;
            font-size: 12px;
            font-weight: bold;
          }
          
          .rating-display.warning {
            background: linear-gradient(135deg, #fd7e14 0%, #ffc107 100%);
          }
        `}
      </style>

      {/* Main Cart and Summary */}
      <div className="row">
        {/* Left column: Cart items */}
        <div className="col-lg-8 mb-4">
          <div className="d-flex align-items-center mb-4">
            <h3 className="fw-bold text-danger mb-0">
              <i className="bi bi-cart3 me-2"></i>
              Shopping Cart
            </h3>
            <span className="badge bg-danger ms-2 rounded-pill">
              {groupedItemsArray.length} items
            </span>
          </div>

          {loading ? (
            Array(3)
              .fill()
              .map((_, i) => (
                <div key={i} className="cart-item mb-4 p-4">
                  <div className="row g-3">
                    <div className="col-4">
                      <Skeleton height={120} borderRadius={10} />
                    </div>
                    <div className="col">
                      <Skeleton height={20} width={`70%`} className="mb-2" />
                      <Skeleton height={16} width={`50%`} className="mb-2" />
                      <Skeleton height={16} width={`60%`} />
                    </div>
                  </div>
                </div>
              ))
          ) : groupedItemsArray.length === 0 ? (
            <div className="empty-cart">
              <h2 className="text-muted mb-3">Your Cart is Empty</h2>
              <p className="text-muted mb-4">
                Browse and add your favorite items to the cart.
              </p>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                className="img-fluid mb-4"
                style={{ maxWidth: "200px" }}
                alt="Empty Cart"
              />
              <br />
              <button
                className="btn btn-outline-danger btn-lg px-5"
                onClick={() => navigate("/customerDashboard")}
              >
                <i className="bi bi-shop me-2"></i>
                Browse Products
              </button>
            </div>
          ) : (
            groupedItemsArray.map((item, i) => (
              <div
                key={i}
                className="cart-item mb-4 p-4"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="d-flex flex-row align-items-center">
                  <img
                    src={item.Thumbnail || "/placeholder.svg"}
                    alt={item.Title}
                    className="cart-image me-4"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/product/${item.ProductId}`)}
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-2" style={{ color: "#333" }}>
                      {item.Title}
                    </h6>
                    <p className="mb-2">
                      <strong className="text-danger fs-5">
                        ₹ {item.Price}
                      </strong>
                    </p>
                    <p className="mb-3">
                      <span
                        className={`rating-display ${
                          item?.Rating >= 4 ? "" : "warning"
                        }`}
                      >
                        {item.Rating} <Star size={12} fill="white" />
                      </span>
                    </p>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn quantity-btn border-danger text-danger me-3"
                        onClick={() => handleDecrement(item)}
                      >
                        <Minus size={20} />
                      </button>
                      <span className="fw-bold fs-5 mx-3">{item.Quantity}</span>
                      <button
                        className="btn quantity-btn border-success text-success"
                        onClick={() => handleIncrement(item)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right column: Order Summary */}
        <div className="col-lg-4">
          {groupedItemsArray.length > 0 && !loading && (
            <div className="order-summary p-4">
              <h5 className="text-center fw-bold text-danger mb-4">
                <i className="bi bi-receipt me-2"></i>
                Order Summary
              </h5>
              <hr />
              {groupedItemsArray.map((item, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between mb-3 pb-2 border-bottom"
                >
                  <div>
                    <small className="text-muted">{item.Title}</small>
                    <br />
                    <span className="fw-bold">
                      {item.Quantity} × ₹{item.Price}
                    </span>
                  </div>
                  <span className="fw-bold text-danger">
                    ₹{item.Price * item.Quantity}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Total:</h5>
                <h5 className="fw-bold text-danger">₹{totalPrice}</h5>
              </div>

              <AddressForm address={address} setAddress={setAddress} />

              <button
                className="btn btn-payment text-white w-100 mt-4 py-3 fw-bold"
                onClick={() => setShowPaymentModal(true)}
              >
                <i className="bi bi-credit-card me-2"></i>
                Select Payment Method
              </button>

              {paymentSuccess && (
                <button
                  className="btn btn-order text-white w-100 mt-3 py-3 fw-bold"
                  onClick={() => setShowConfirmModal(true)}
                >
                  <i className="bi bi-bag-check me-2"></i>
                  Place Order
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            {address.line1 &&
            address.city &&
            address.state &&
            address.country &&
            address.postalCode ? (
              <div className="modal-content p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-danger mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    Select Payment Method
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPaymentModal(false)}
                  ></button>
                </div>

                <div className="mb-3">
                  <div className="form-check p-3 border rounded mb-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label fw-bold">
                      <i className="bi bi-phone me-2 text-primary"></i>
                      UPI Payment
                    </label>
                  </div>
                  <div className="form-check p-3 border rounded">
                    <input
                      type="radio"
                      className="form-check-input"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label fw-bold">
                      <i className="bi bi-cash me-2 text-success"></i>
                      Cash on Delivery
                    </label>
                  </div>
                </div>

                {paymentMethod === "UPI" && (
                  <div className="mb-4">
                    <label className="form-label fw-bold">UPI ID</label>
                    <input
                      className="form-control form-control-lg"
                      placeholder="Enter your UPI ID (e.g., user@paytm)"
                      value={upiID}
                      onChange={(e) => setUpiID(e.target.value)}
                    />
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary px-4"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success px-4"
                    onClick={handlePaymentSubmit}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Confirm Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-content p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <AlertCircle className="me-2 text-warning" size={24} />
                    <h5 className="mb-0 text-warning">Address Required</h5>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPaymentModal(false)}
                  ></button>
                </div>
                <div className="alert alert-warning border-0">
                  <p className="mb-0">
                    Please fill in the complete address form before proceeding
                    with payment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <div className="text-center mb-4">
                <i className="bi bi-question-circle text-warning fs-1 mb-3"></i>
                <h5 className="fw-bold">Confirm Your Order</h5>
                <p className="text-muted">
                  Are you sure you want to place this order?
                </p>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-secondary px-4"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={handleOrderNow}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Yes, Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Placed Modal */}
      {orderPlaced && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-5">
              <CheckCircle size={64} className="text-success mb-4 mx-auto" />
              <h4 className="mb-3 fw-bold text-success">
                Order Placed Successfully!
              </h4>
              <p className="mb-4 text-muted">
                Thank you for your purchase. Your order has been confirmed and
                will be processed shortly.
              </p>
              <button
                className="btn btn-primary px-5 py-2"
                onClick={() => {
                  setOrderPlaced(false);
                  navigate("/orders");
                }}
              >
                <i className="bi bi-list-check me-2"></i>
                View My Orders
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={2500} />
    </div>
  );
}

export default Cart;
