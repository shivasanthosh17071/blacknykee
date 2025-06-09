// Enhanced AdminOrders Component
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Form,
  Modal,
  InputGroup,
  FormControl,
  Pagination,
  Spinner,
  Badge,
  Collapse,
  OverlayTrigger,
  Tooltip,
  Alert,
} from "react-bootstrap";
import BASE_URL from "./config/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openOrders, setOpenOrders] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const itemsPerPage = 5;

  const statusOptions = [
    "Processing",
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder) return;
    try {
      await axios.put(`${BASE_URL}/order/status`, {
        userId: selectedOrder.customerId,
        orderDate: selectedOrder.orderDate,
        newStatus,
      });
      setStatusMessage(`Order status updated to '${newStatus}' successfully.`);
      setShowModal(false);
      setSelectedOrder(null);
      setNewStatus("");
      fetchOrders();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const cancelStatusChange = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleSelectChange = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setShowModal(true);
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.customer.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const getValidStatusOptions = (currentStatus) => {
    const currentIndex = statusOptions.indexOf(currentStatus);
    return statusOptions.map((status, idx) => ({
      label: status,
      disabled: idx < currentIndex && currentStatus !== "Cancelled",
    }));
  };

  const statusBadgeColor = {
    Processing: "secondary",
    Confirmed: "info",
    Shipped: "primary",
    "Out for Delivery": "warning",
    Delivered: "success",
    Cancelled: "danger",
  };

  const toggleCollapse = (orderId) => {
    setOpenOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-primary mb-3">📦 All Customer Orders</h2>
      <p className="text-muted">
        View, search, and manage customer orders. You can change the order
        status and see detailed product information.
      </p>

      {statusMessage && (
        <Alert
          variant="success"
          onClose={() => setStatusMessage("")}
          dismissible
        >
          {statusMessage}
        </Alert>
      )}

      <InputGroup className="mb-4">
        <FormControl
          placeholder="Search by customer, email, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="alert alert-warning">No orders found.</div>
      ) : (
        paginatedOrders.map((order, index) => (
          <Card className="mb-4 shadow-sm" key={order._id}>
            <Card.Header className="d-flex justify-content-between align-items-center bg-light">
              <div>
                <strong>#{index + 1 + (currentPage - 1) * itemsPerPage}</strong>{" "}
                - {order.customer}
                <Badge
                  bg={statusBadgeColor[order.status]}
                  className="ms-2 text-capitalize"
                >
                  {order.status}
                </Badge>
              </div>
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => toggleCollapse(order._id)}
              >
                {openOrders[order._id] ? "Hide" : "View"} Details
              </Button>
            </Card.Header>
            <Collapse in={openOrders[order._id]}>
              <Card.Body>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.totalAmount}
                </p>
                <p>
                  <strong>Payment:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Shipping:</strong> {order.address.line1},{" "}
                  {order.address.city}
                </p>

                <div className="mb-2">
                  <strong>Status: </strong>
                  <Form.Select
                    style={{
                      display: "inline",
                      width: "200px",
                      marginLeft: "10px",
                    }}
                    value={order.status}
                    onChange={(e) => handleSelectChange(order, e.target.value)}
                  >
                    {getValidStatusOptions(order.status).map((opt) => (
                      <OverlayTrigger
                        key={opt.label}
                        placement="top"
                        overlay={
                          <Tooltip>
                            {opt.disabled
                              ? "Cannot revert to previous status"
                              : "Click to update status"}
                          </Tooltip>
                        }
                      >
                        <option value={opt.label} disabled={opt.disabled}>
                          {opt.label}
                        </option>
                      </OverlayTrigger>
                    ))}
                  </Form.Select>
                </div>

                <div>
                  <strong>Items:</strong>
                  {order.items.length === 0 ? (
                    <div className="text-muted">No items in this order.</div>
                  ) : (
                    order.items.map((item, i) => (
                      <div
                        key={i}
                        className="d-flex align-items-center gap-3 mt-2"
                      >
                        <img
                          src={item.Thumbnail}
                          alt={item.Title}
                          style={{ width: "50px", borderRadius: "5px" }}
                        />
                        <span>
                          {item.Title} (x{item.Quantity}) - ₹{item.Price}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card.Body>
            </Collapse>
          </Card>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center sticky-bottom bg-white py-3">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Status Confirmation Modal */}
      <Modal
        show={showModal}
        onHide={cancelStatusChange}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the order status to{" "}
          <strong>{newStatus}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelStatusChange}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusChange}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders;
