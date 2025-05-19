import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Account({ accountDetails, setAccountDetails, loginStatus }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(accountDetails);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios("https://amazon-backend-k8m7.onrender.com/getusers").then((res) =>
      setUsers(res.data)
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  console.log(formData);
  // const handleSave = () => {
  //   setAccountDetails(formData);
  //   setEditMode(false);
  // };
  const handleSave = async () => {
    try {
      const response = await axios.put(
        "https://amazon-backend-k8m7.onrender.com/updateuser",
        formData
      );
      if (response.status === 200) {
        setAccountDetails(formData);
        setEditMode(false);
        alert("Profile updated successfully!");
      } else {
        alert("Error updating profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Update faild : Please check all feilds properly.");
    }
  };

  const orders =
    users.find((u) => u.Email === accountDetails.Email)?.orders || [];

  return (
    <div className="container my-4 px-2 px-md-4">
      {loginStatus.Role === 0 ? (
        // Customer View
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
                  { label: "Email", key: "Email", type: "email" },
                  { label: "Address", key: "Address", type: "textarea" },
                ].map(({ label, key, type, options, suffix }) => (
                  <tr key={key}>
                    <td className="text-muted fw-medium">{label}:</td>
                    <td>
                      {editMode ? (
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

            <h5 className="mt-5 mb-3 border-bottom pb-2 text-secondary">
              Order History
            </h5>
            {orders.length === 0 ? (
              <p className="text-muted">No orders found.</p>
            ) : (
              orders.map((order, index) => (
                <div key={index} className="border rounded p-3 mb-4 shadow-sm">
                  <div className="d-flex justify-content-between">
                    <div>
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
        </div>
      ) : (
        // Admin View
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

          {/* Modal */}
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
                  <h5 className="modal-title">
                    Orders of {selectedUser?.Name}
                  </h5>
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
                            <span className="badge bg-warning text-dark">
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
                              width="60"
                              height="60"
                              className="rounded me-3"
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
        </div>
      )}
    </div>
  );
}

export default Account;
