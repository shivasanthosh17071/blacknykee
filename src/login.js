import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";

function Login({
  loginStatus,
  setLoginStatus,
  setAccountDetails,
  accountDetails,
  setShowLoginModal,
  setRegisterForm,
}) {
  const [login, setLogin] = useState({ Email: "", Password: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showServerIssueModal, setShowServerIssueModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function loginUserChange(field, value) {
    setLogin({ ...login, [field]: value });
  }

  function loginButton() {
    if (login?.Email && login?.Password) {
      setLoading(true); // Show loader
      axios
        .post("https://amazon-backend-k8m7.onrender.com/login", login)
        .then((res) => {
          setLoading(false); // Hide loader
          if (res?.data?.Message) {
            setLoginStatus({
              ...loginStatus,
              Status: false,
              Message: res?.data?.Message,
            });
          } else if (res?.data?.Success) {
            setTimeout(() => {
              const user = res?.data?.usersDetails;

              const newLoginStatus = {
                Status: true,
                Message: res?.data?.Success,
                Role: user?.Role,
                Name: user?.Name,
                Id: user?._id,
              };
              sessionStorage.removeItem("loginStatus");
              sessionStorage.removeItem("accountDetails");
              // ✅ Save both to localStorage
              sessionStorage.setItem(
                "loginStatus",
                JSON.stringify(newLoginStatus)
              );
              sessionStorage.setItem("accountDetails", JSON.stringify(user));

              setLoginStatus(newLoginStatus);
              setAccountDetails(user);
              setShowSuccessModal(true);
            }, 1000);
          }
          // {
          //             setTimeout(() => {
          //               const user = res?.data?.usersDetails;
          //               setLoginStatus({
          //                 ...loginStatus,
          //                 Status: true,
          //                 Message: res?.data?.Success,
          //                 Role: user?.Role,
          //                 Name: user?.Name,
          //                 Id: user?._id,
          //               });

          //               setAccountDetails(user);
          //               setShowSuccessModal(true);

          //               // Optional: auto-close modal after success
          //               setTimeout(() => {
          //                 setShowSuccessModal(false);
          //                 setShowLoginModal(false);
          //               }, 3000);
          //             }, 1000);
          //           }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err, "server issue");
          setShowServerIssueModal(true);
        });
    } else {
      alert("Please fill in all fields.");
    }
  }

  const modalBackdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    transform: "scale(0.95)",
    opacity: 0,
    transition: "all 0.3s ease-in-out",
  };

  const fadeInStyle = {
    transform: "scale(1)",
    opacity: 1,
  };

  const exploreButtonStyle = {
    backgroundColor: "red",
    color: "#fff",
    fontWeight: "600",
    marginTop: "15px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    width: "100%",
    cursor: "pointer",
  };

  return (
    <>
      <div
        className="p-4 rounded"
        style={{
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <div className="text-center mb-4">
          <h5 style={{ color: "#212529", fontWeight: "600" }}>
            Sign In to Your Account
          </h5>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#333" }}>
            Email
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={login.Email}
            onChange={(e) => loginUserChange("Email", e.target.value)}
            style={{
              borderColor: "#ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "red")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#333" }}>
            Password
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={login.Password}
            onChange={(e) => loginUserChange("Password", e.target.value)}
            style={{
              borderColor: "#ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "red")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        {loginStatus.Status === true && (
          <p className="text-success" style={{ fontSize: "14px" }}>
            ✅ Login successful
          </p>
        )}

        {loginStatus.Status === false && (
          <p className="text-danger" style={{ fontSize: "14px" }}>
            ❌ {loginStatus.Message}
          </p>
        )}

        <p style={{ fontSize: "12px", color: "#555" }}>
          By continuing, you agree to our{" "}
          <span style={{ color: "red", fontWeight: "500" }}>Terms</span> and{" "}
          <span style={{ color: "red", fontWeight: "500" }}>
            Privacy Policy
          </span>
          .
        </p>

        <button
          className="btn w-100"
          style={{
            backgroundColor: "red",
            color: "#fff",
            fontWeight: "600",
            marginTop: "10px",
            borderRadius: "5px",
            padding: "10px",
            transition: "0.3s",
          }}
          onClick={loginButton}
        >
          Continue
        </button>

        <hr style={{ margin: "20px 0", borderColor: "#bbb" }} />

        <p className="text-center" style={{ color: "#000" }}>
          Not registered yet?{" "}
          <span
            style={{
              color: "red",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              setRegisterForm(true);
            }}
          >
            Sign Up
          </span>
        </p>
      </div>

      {/* 🔄 Loader */}
      {loading && <Loader />}

      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <div className="modal-backdrop" style={modalBackdropStyle}>
          <div
            className="modal-content"
            style={{ ...modalContentStyle, ...fadeInStyle }}
          >
            <h5 style={{ color: "green", fontWeight: "bold" }}>
              ✅ Login Successful!
            </h5>
            <p style={{ marginTop: "10px", fontSize: "14px" }}>
              Welcome back! You can now explore the platform.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setShowLoginModal(false);
              }}
              style={exploreButtonStyle}
            >
              Explore Now
            </button>
          </div>
        </div>
      )}

      {/* ❌ Server Issue Modal */}
      {showServerIssueModal && (
        <div className="modal-backdrop" style={modalBackdropStyle}>
          <div
            className="modal-content"
            style={{
              ...modalContentStyle,
              border: "1px solid red",
              ...fadeInStyle,
            }}
          >
            <h5 className=" fw-bold mb-3"> Server Error</h5>
            <p className="text-muted">
              Sorry! A server issue occurred. <br />
              Please try again after refreshing the page.
            </p>
            <button
              style={{
                backgroundColor: "red",
                color: "#fff",
                fontWeight: "600",
                marginTop: "10px",
                borderRadius: "5px",
                padding: "10px",
                transition: "0.3s",
              }}
              className="btn  w-100 mt-3"
              onClick={() => setShowServerIssueModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
