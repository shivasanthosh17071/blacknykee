import React, { useEffect, useState } from "react";
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
import { X } from "lucide-react";

function Cart({ loginStatus }) {
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
      .get(`https://amazon-backend-k8m7.onrender.com/${loginStatus.Id}/cart`)
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
      .put(
        `https://amazon-backend-k8m7.onrender.com/decreaseQuantity/${loginStatus.Id}/${item.ProductId}`
      )
      .then((res) => {
        setCartItems(res.data.cartItems);
        toast.info("Item quantity decreased");
      })
      .catch((err) => console.log(err));
  };

  const handleIncrement = (item) => {
    axios
      .put(
        `https://amazon-backend-k8m7.onrender.com/increaseQuantity/${loginStatus.Id}/${item.ProductId}`
      )
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
      await axios.post(
        `https://amazon-backend-k8m7.onrender.com/${loginStatus.Id}/order`,
        orderData
      );
      toast.success("Order placed successfully");
      dispatch(clearCart());
      setShowConfirmModal(false);
      setOrderPlaced(true); // Show confirmation modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="container py-3">
      {/* Main Cart and Summary */}
      <div className="row">
        {/* Left column: Cart items */}
        <div className="col-lg-8 mb-4">
          {loading ? (
            Array(3)
              .fill()
              .map((_, i) => (
                <div key={i} className="card mb-3 p-3 shadow-sm">
                  <div className="row g-3">
                    <div className="col-4">
                      <Skeleton height={100} />
                    </div>
                    <div className="col">
                      <Skeleton height={15} width={`60%`} />
                      <Skeleton height={15} width={`40%`} />
                      <Skeleton height={15} width={`50%`} />
                    </div>
                  </div>
                </div>
              ))
          ) : groupedItemsArray.length === 0 ? (
            <div className="text-center text-muted">
              <h2>Your Cart is Empty</h2>
              <p>Browse and add your favorite items to the cart.</p>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                className="img-fluid mt-3"
                style={{ maxWidth: "150px" }}
                alt="Empty Cart"
              />
              <br />
              <button
                className="btn mt-4 btn-outline-primary"
                onClick={() => navigate("/customerDashboard")}
              >
                Browse Products
              </button>
            </div>
          ) : (
            groupedItemsArray.map((item, i) => (
              <div key={i} className="card mb-3 p-3 shadow-sm">
                <div className="d-flex flex-row align-items-center">
                  <img
                    src={item.Thumbnail}
                    alt={item.Title}
                    className="me-3 rounded"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      cursor: "pointer",
                      border: "1px solid #ddd",
                    }}
                    onClick={() => navigate(`/product/${item.ProductId}`)}
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold">{item.Title}</h6>
                    <p className="mb-1">
                      <strong className="text-danger">₹ {item.Price}</strong>
                    </p>
                    <p className="mb-2">
                      <strong>Rating:</strong>{" "}
                      <span
                        className={`text-${
                          item?.Rating >= 4 ? "success" : "warning"
                        }`}
                      >
                        {item.Rating} <Star size={16} fill="gold" />
                      </span>
                    </p>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-danger btn-sm me-2"
                        onClick={() => handleDecrement(item)}
                      >
                        <Minus size={18} />
                      </button>
                      <span className="mx-2">{item.Quantity}</span>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleIncrement(item)}
                      >
                        <Plus size={18} />
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
            <div className="card p-3 shadow-sm mb-4">
              <h5 className="text-center">Order Summary</h5>
              <hr />
              {groupedItemsArray.map((item, i) => (
                <div key={i} className="d-flex justify-content-between mb-2">
                  <span>{item.Title}</span>
                  <span>
                    {item.Quantity} × ₹{item.Price}
                  </span>
                </div>
              ))}
              <hr />
              <p>
                <strong>Total: ₹{totalPrice}</strong>
              </p>

              <AddressForm address={address} setAddress={setAddress} />

              <button
                style={{ background: "gray", color: "white" }}
                className="btn  w-100 mt-3"
                onClick={() => setShowPaymentModal(true)}
              >
                Select Payment Method
              </button>

              {paymentSuccess && (
                <button
                  style={{ background: "red", color: "white" }}
                  className="btn  w-100 mt-2"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Order Now
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
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            {address.line1 &&
            address.city &&
            address.state &&
            address.country &&
            address.postalCode ? (
              <div className="modal-content p-3">
                <h5>Select Payment Method</h5>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label">UPI</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label">Cash on Delivery</label>
                </div>

                {paymentMethod === "UPI" && (
                  <input
                    className="form-control mt-3"
                    placeholder="Enter your UPI ID"
                    value={upiID}
                    onChange={(e) => setUpiID(e.target.value)}
                  />
                )}

                <div className="mt-3 d-flex justify-content-end">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handlePaymentSubmit}
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-content p-3">
                <div className="d-flex justify-content-between">
                  <p>
                    <AlertCircle className="me-1 h-5 w-5 text-yellow-600" />{" "}
                    Alert
                  </p>
                  <p onClick={() => setShowPaymentModal(false)}>
                    <X />
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-4">
                  <p>
                    Please fill in the address form before proceeding with
                    payment.
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
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5>Confirm Your Order</h5>
              <p>Are you sure you want to place the order?</p>
              <div className="mt-3 d-flex justify-content-end">
                <button
                  style={{ background: "gray", color: "white" }}
                  className="btn  me-2"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ background: "red", color: "white" }}
                  className="btn "
                  onClick={handleOrderNow}
                >
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
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <CheckCircle size={48} className="text-success mb-3 mx-auto" />
              <h4 className="mb-2">Thank you for your order!</h4>
              <p className="mb-3">Your order has been placed successfully.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setOrderPlaced(false);
                  navigate("/orders");
                }}
              >
                Go to My Orders
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
