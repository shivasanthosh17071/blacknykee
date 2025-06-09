import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BASE_URL from "./config/api";
import html2pdf from "html2pdf.js";
import blackNykee from "./Images/BLacknykee.png";
const MyOrders = ({ loginStatus }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios(`${BASE_URL}/getusers`).then((res) => setUsers(res.data));
  }, []);

  const orders = users.find((u) => u._id === loginStatus.Id)?.orders || [];

  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) =>
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, orders]);

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

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-primary">🛒 My Orders</h3>

      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by status (e.g., Confirmed)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {filteredOrders.length === 0 ? (
        <div className="alert alert-warning">No orders found.</div>
      ) : (
        <div className="row">
          {filteredOrders.map((order, index) => (
            <div className="col-12 mb-4" key={index}>
              <Card className="shadow border-0">
                <Card.Body>
                  <Card.Title className="mb-3">
                    <strong>Order #{index + 1}</strong>
                  </Card.Title>

                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <p className="mb-1">
                        <strong>Date:</strong>{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p className="mb-1">
                        <strong>Payment:</strong> {order.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1">
                        <strong>Status:</strong>{" "}
                        <span className="badge bg-success">{order.status}</span>
                      </p>
                    </div>
                  </div>

                  <hr />

                  <div className="d-flex flex-wrap gap-3 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="d-flex align-items-center gap-3">
                        <img
                          src={item.Thumbnail}
                          alt={item.Title}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate(`/product/${item.ProductId}`)}
                        />
                        <div>
                          <p className="mb-1 fw-bold">{item.Title}</p>
                          <p className="mb-0 text-muted">
                            Qty: {item.Quantity} | ₹{item.Price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />
                  <p>
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>

                  <div className="bg-light p-2 rounded mt-3">
                    <p className="mb-1 fw-semibold">Shipping Address:</p>
                    <p className="mb-0 text-muted">
                      {order.address.line1}, {order.address.city},{" "}
                      {order.address.state} - {order.address.postalCode},{" "}
                      {order.address.country}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-secondary"
                      className="w-45"
                      size="sm"
                      onClick={() => handleDownloadInvoice(index, order)}
                    >
                      View Invoice
                    </Button>
                    <Button variant="outline-info" className="w-45" size="sm">
                      Track Delivery
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Enhanced Invoice Template */}
              <div
                id={`invoice-${index}`}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "0",
                  visibility: "hidden",
                  fontFamily: "Arial, sans-serif",
                  width: "700px",
                  padding: "40px",
                  backgroundColor: "#fff",
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <h1 style={{ color: "#2c3e50" }}>BLACKNYKEE</h1>
                  <h3 style={{ color: "#3498db" }}>Invoice</h3>
                </div>

                <div style={{ marginBottom: "20px" }}>
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

                <hr />

                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ color: "#2c3e50" }}>Shipping Address</h4>
                  <p style={{ margin: 0 }}>
                    {order.address.line1}, {order.address.city},{" "}
                    {order.address.state} - {order.address.postalCode},{" "}
                    {order.address.country}
                  </p>
                </div>

                <hr />

                <div>
                  <h4 style={{ color: "#2c3e50" }}>Items</h4>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f0f0f0", color: "#333" }}>
                        <th
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
                          Product
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
                          Qty
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
                          Price
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={i}>
                          <td
                            style={{ padding: "8px", border: "1px solid #ccc" }}
                          >
                            {item.Title}
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ccc" }}
                          >
                            {item.Quantity}
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ccc" }}
                          >
                            ₹{item.Price}
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ccc" }}
                          >
                            ₹{item.Price * item.Quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  <h4 style={{ color: "#2c3e50" }}>
                    Total: ₹{order.totalAmount}
                  </h4>
                </div>

                <hr />

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    fontSize: "0.9rem",
                    color: "#999",
                  }}
                >
                  <p>Thank you for shopping with BLACKNYKEE!</p>
                  <p>www.blacknykee.com</p>{" "}
                  <img style={{ width: "170px" }} src={blackNykee} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
