import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "./config/api";
import Wishlist from "./wishlist";
import html2pdf from "html2pdf.js";
import blackNykee from "./Images/BLacknykee.png";
import { Card, Button, Form } from "react-bootstrap";
import ReferralProgram from "./ReferralProgram";
function Account({ accountDetails, setAccountDetails, loginStatus }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(accountDetails);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios(`${BASE_URL}/getusers`).then((res) => setUsers(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/updateuser`, formData);
      if (response.status === 200) {
        setAccountDetails(formData);
        setEditMode(false);
        alert("Profile updated successfully!");
      } else {
        alert("Error updating profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Update failed: Please check all fields properly.");
    }
  };

  function handleSignOut() {
    setShowLogoutModal(true);
  }

  const handleDownloadInvoice = (index, order) => {
    const element = document.getElementById(`invoice-${index}`);
    if (!element) return;

    // Temporarily make it visible
    element.style.visibility = "visible";
    element.style.position = "static";

    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: `invoice-order-${index + 1}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save()
      .then(() => {
        // Re-hide after generation
        element.style.visibility = "hidden";
        element.style.position = "absolute";
        element.style.left = "-9999px";
        element.style.top = "0";
      });
  };

  const orders =
    users.find((u) => u.Email === accountDetails.Email)?.orders || [];

  return (
    <div className="container px-0 px-md-4 mt-4">
      <ul className="nav nav-tabs mb-4"
        style={{
          fontSize:"12px",
    display: "flex",
    position: "sticky",
    top: "64px",
    zIndex: "100",
    overflowX: "auto",
    background: "rgba(255, 255, 255, 0.18)", // semi-transparent white
    backdropFilter: "blur(8px)",             // blur effect
    WebkitBackdropFilter: "blur(8px)",       // for Safari support
  }}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            Wishlist
          </button>
        </li>
        {loginStatus.Role === 0 && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
          </li>
        )}
        {loginStatus.Role === 1 && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => setActiveTab("admin")}
            >
              Admin Panel
            </button>
          </li>
        )}
        {loginStatus.Role === 0 && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "refer" ? "active" : ""}`}
              onClick={() => setActiveTab("refer")}
            >
              Refer
            </button>
          </li>
        )}
        <li className="nav-item ms-auto">
          <button
            className="nav-link text-danger"
            onClick={() => handleSignOut()}
          >
            Sign Out
          </button>
        </li>
      </ul>

      {/* Tabs Content */}
      {activeTab === "profile" && (
        <div className="row g-4">
          <div className="col-md-4 text-center d-flex flex-column align-items-center border-end">
            <img
              className="img-fluid rounded-circle shadow-sm mb-3"
              src="https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"
              alt="Profile"
              width="140"
              height="140"
            />
            <h4 className="fw-bold text-primary">{formData?.Name || "User"}</h4>
            <button
              className={`btn ${
                editMode ? "btn-success" : "btn-outline-primary"
              } mt-3 w-75`}
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
            >
              {editMode ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          <div className="col-md-8">
            <h5 className="border-bottom pb-2 mb-3 text-secondary">
              Account Information
            </h5>
            <table className="table table-borderless">
              <tbody>
                {[
                  { label: "Name", key: "Name", type: "text" },
                  {
                    label: "Age",
                    key: "Age",
                    type: "number",
                    suffix: " years",
                  },
                  {
                    label: "Gender",
                    key: "Gender",
                    type: "select",
                    options: [
                      { label: "Male", value: 0 },
                      { label: "Female", value: 1 },
                    ],
                  },
                  { label: "Mobile", key: "PhoneNumber", type: "tel" },
                  {
                    label: "Email",
                    key: "Email",
                    type: "email",
                    readonly: true,
                  },
                  { label: "Address", key: "Address", type: "textarea" },
                ].map(({ label, key, type, options, suffix, readonly }) => (
                  <tr key={key}>
                    <td className="text-muted fw-medium">{label}:</td>
                    <td>
                      {editMode && !readonly ? (
                        type === "textarea" ? (
                          <textarea
                            name={key}
                            className="form-control"
                            rows="2"
                            value={formData?.[key] || ""}
                            onChange={handleChange}
                          />
                        ) : type === "select" ? (
                          <select
                            name={key}
                            className="form-select"
                            value={formData?.[key]}
                            onChange={handleChange}
                          >
                            {options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={type}
                            name={key}
                            className="form-control"
                            value={formData?.[key] || ""}
                            onChange={handleChange}
                          />
                        )
                      ) : (
                        <>
                          {key === "Gender"
                            ? accountDetails?.Gender === 0
                              ? "Male"
                              : "Female"
                            : accountDetails?.[key] || "N/A"}
                          {suffix && accountDetails?.[key] ? suffix : ""}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="text-muted fw-medium">Role:</td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {accountDetails?.Role === 0 ? "Customer" : "Admin"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="text-center p-4">
          <Wishlist />
        </div>
      )}

      {activeTab === "orders" && (
        <div className="container py-4">
          <h5 className="mb-4 border-bottom pb-2 text-secondary text-center fw-bold">
            Order History
          </h5>
          {orders.length === 0 ? (
            <p className="text-muted text-center">No orders found.</p>
          ) : (
            orders.map((order, index) => (
              <div
                key={index}
                className="card mb-4 shadow-sm"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <div className="card-body">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                    <div
                      className="mb-2 mb-md-0 text-truncate"
                      style={{ maxWidth: "60vw" }}
                    >
                      <strong>Date:</strong>{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <span className="badge bg-warning text-dark">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                    <div className="mb-3 mb-md-0 text-muted small">
                      <strong>Payment:</strong> {order.paymentMethod} |{" "}
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        style={{
                          borderRadius: "20px",
                          fontWeight: "600",
                          padding: "6px 20px",
                          whiteSpace: "nowrap",
                          minWidth: "110px",
                        }}
                        onClick={() => handleDownloadInvoice(index, order)}
                      >
                        🧾 View Invoice
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        style={{
                          borderRadius: "20px",
                          fontWeight: "600",
                          padding: "6px 20px",
                          whiteSpace: "nowrap",
                          minWidth: "110px",
                        }}
                      >
                        🚚 Track Delivery
                      </button>
                    </div>
                  </div>

                  {/* Hidden Invoice */}
                  <div
                    id={`invoice-${index}`}
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      top: "0",
                      visibility: "hidden",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      width: "700px",
                      maxWidth: "95vw",
                      padding: "40px",
                      backgroundColor: "#fff",
                      color: "#333",
                      border: "1px solid #ddd",
                      borderRadius: "12px",
                      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ textAlign: "center", marginBottom: "25px" }}>
                      <h1
                        style={{
                          color: "#222",
                          letterSpacing: "2px",
                          fontWeight: "700",
                        }}
                      >
                        BLACKNYKEE
                      </h1>
                      <h3 style={{ color: "#007bff", fontWeight: "600" }}>
                        Invoice
                      </h3>
                    </div>

                    <div style={{ marginBottom: "20px", fontSize: "1rem" }}>
                      <p>
                        <strong>Order #:</strong> {index + 1}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      <p>
                        <strong>Payment Method:</strong> {order.paymentMethod}
                      </p>
                    </div>

                    <hr style={{ borderColor: "#eee" }} />

                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ color: "#222", fontWeight: "600" }}>
                        Shipping Address
                      </h4>
                      <p style={{ margin: 0, lineHeight: 1.5 }}>
                        {order.address.line1}, {order.address.city},{" "}
                        {order.address.state} - {order.address.postalCode},{" "}
                        {order.address.country}
                      </p>
                    </div>

                    <hr style={{ borderColor: "#eee" }} />

                    <div>
                      <h4 style={{ color: "#222", fontWeight: "600" }}>
                        Items
                      </h4>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "0.95rem",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "#f8f9fa",
                              color: "#333",
                            }}
                          >
                            {["Product", "Qty", "Price", "Subtotal"].map(
                              (header) => (
                                <th
                                  key={header}
                                  style={{
                                    padding: "10px",
                                    borderBottom: "2px solid #ddd",
                                    textAlign: "left",
                                  }}
                                >
                                  {header}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, i) => (
                            <tr
                              key={i}
                              style={{ borderBottom: "1px solid #eee" }}
                            >
                              <td style={{ padding: "10px" }}>{item.Title}</td>
                              <td style={{ padding: "10px" }}>
                                {item.Quantity}
                              </td>
                              <td style={{ padding: "10px" }}>₹{item.Price}</td>
                              <td style={{ padding: "10px" }}>
                                ₹{item.Price * item.Quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div
                      style={{
                        marginTop: "25px",
                        textAlign: "right",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#222",
                      }}
                    >
                      Total: ₹{order.totalAmount}
                    </div>

                    <hr style={{ borderColor: "#eee" }} />

                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "20px",
                        fontSize: "0.9rem",
                        color: "#777",
                        lineHeight: 1.4,
                      }}
                    >
                      <p>Thank you for shopping with BLACKNYKEE!</p>
                      <p>www.blacknykee.com</p>
                      <img
                        style={{ width: "140px", marginTop: "10px" }}
                        src={blackNykee}
                        alt="BLACKNYKEE Logo"
                      />
                    </div>
                  </div>

                  <hr />

                  {/* Order Items */}
                  <div className="row gx-3 gy-3">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="col-12 col-sm-6 col-md-4 d-flex align-items-center border rounded p-2"
                        style={{ backgroundColor: "#fafafa" }}
                      >
                        <img
                          src={item.Thumbnail}
                          alt={item.Title}
                          className="rounded me-3 flex-shrink-0"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div
                            className="fw-semibold text-truncate"
                            style={{ maxWidth: "calc(100vw - 100px)" }}
                          >
                            {item.Title}
                          </div>
                          <small className="text-muted">
                            ₹{item.Price} x {item.Quantity}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "admin" && loginStatus.Role === 1 && (
        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="text-primary fw-bold text-center mb-4">User List</h3>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Role</th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.Name}</td>
                    <td>{user.Email}</td>
                    <td>{user.PhoneNumber}</td>
                    <td>{user.Age}</td>
                    <td>
                      <span className="badge bg-info">
                        {user.Gender === "0" ? "Male" : "Female"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.Role === 1
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {user.Role === 1 ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>
                      {user.Role === 0 ? (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#userOrdersModal"
                          onClick={() => setSelectedUser(user)}
                        >
                          👁 View
                        </button>
                      ) : (
                        "NA"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "refer" && loginStatus.Role === 0 && <ReferralProgram />}

      {/* Admin Orders Modal */}
      <div
        className="modal fade"
        id="userOrdersModal"
        tabIndex="-1"
        aria-labelledby="userOrdersModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Orders of {selectedUser?.Name}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {selectedUser?.orders?.length === 0 ? (
                <p className="text-muted">No orders found.</p>
              ) : (
                selectedUser?.orders?.map((order, index) => (
                  <div
                    key={index}
                    className="border rounded p-3 mb-4 shadow-sm"
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>Date:</strong>{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Status:</strong>{" "}
                        <span className="badge bg-success text-dark">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <strong>Payment:</strong> {order.paymentMethod} |{" "}
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </div>
                    <hr />
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="d-flex align-items-center mb-2 pb-2 border-bottom"
                      >
                        <img
                          src={item.Thumbnail}
                          alt={item.Title}
                          className="rounded me-3"
                          width="60"
                          height="60"
                        />
                        <div>
                          <div className="fw-semibold">{item.Title}</div>
                          <small>
                            ₹{item.Price} x {item.Quantity}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
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
                  onClick={() => {
                    setShowLogoutModal(false);
                  }}
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
                    sessionStorage.removeItem("loginStatus");
                    sessionStorage.removeItem("accountDetails");
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
    </div>
  );
}

export default Account;
