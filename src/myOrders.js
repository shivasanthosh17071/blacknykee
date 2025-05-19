import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyOrders = ({ loginStatus }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios("https://amazon-backend-k8m7.onrender.com/getusers").then((res) =>
      setUsers(res.data)
    );
  }, []);

  // Get the orders for the logged-in user
  const orders = users.find((u) => u._id === loginStatus.Id)?.orders || [];

  // Filter orders based on the search query
  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) =>
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, orders]);

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-primary">🛒 My Orders</h3>

      {/* Search Bar for Filtering Orders */}
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by status (e.g., Confirmed)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {/* No Orders Found or Displaying Filtered Orders */}
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

                  {/* Order Details Section */}
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

                  {/* Displaying Ordered Items */}
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

                  {/* Shipping Address */}
                  <div className="bg-light p-2 rounded mt-3">
                    <p className="mb-1 fw-semibold">Shipping Address:</p>
                    <p className="mb-0 text-muted">
                      {order.address.line1}, {order.address.city},{" "}
                      {order.address.state} - {order.address.postalCode},{" "}
                      {order.address.country}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-secondary"
                      className="w-45"
                      size="sm"
                    >
                      View Invoice
                    </Button>
                    <Button variant="outline-info" className="w-45" size="sm">
                      Track Delivery
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
