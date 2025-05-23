import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "./config/api";

function Register({ setRegisterForm }) {
  const [register, setRegister] = useState({
    Name: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    Role: "",
    Gender: "",
    Address: "",
    Age: "",
  });

  const [registerStatus, setRegisterStatus] = useState({
    Status: null,
    Message: "",
  });

  const navigate = useNavigate();

  function usersDetailsChange(field, value) {
    setRegister({ ...register, [field]: value });
  }

  function submitRegister() {
    const { Name, Email, PhoneNumber, Password, Role } = register;
    if (Name && Email && PhoneNumber && Password && Role !== "") {
      axios
        .post(`${BASE_URL}/signup`, register)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setRegisterStatus({
              Status: true,
              Message: res.data.success,
            });
            // here add modol to show succes
            alert("Registered successfully.");
            setRegisterForm(false);
          } else {
            setRegisterStatus({
              Status: false,
              Message: "User Registration failed",
            });
          }
        })
        .catch((err) => {
          console.log(err.response.data.error);
          setRegisterStatus({
            Status: false,
            Message: err.response.data.error,
          });
        });
    } else {
      alert("Please fill all required fields.");
    }
  }

  const containerStyle = {
    maxWidth: "480px",
    width: "100%",
    padding: "30px 25px",
    borderRadius: "12px",
    // boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  };

  const labelStyle = {
    fontWeight: "700",
    color: "#222",
    marginBottom: "6px",
  };

  const inputStyle = {
    borderColor: "#ccc",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "15px",
    transition: "border-color 0.3s",
  };

  const inputFocusStyle = {
    borderColor: "red",
    outline: "none",
    boxShadow: "#ccc",
  };

  const buttonStyle = {
    backgroundColor: "red",
    color: "#fff",
    fontWeight: "600",
    marginTop: "15px",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    width: "100%",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#cc0000",
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      <div style={containerStyle}>
        <div className="text-center mb-4">
          {/* <img src={Logo} alt="logo" style={{ width: "60px" }} /> */}
          <h4 style={{ fontWeight: "700", color: "#222" }}>
            Create Your Account
          </h4>
        </div>

        {[
          {
            label: "Name",
            type: "text",
            field: "Name",
            placeholder: "Enter your name",
          },
          {
            label: "Age",
            type: "number",
            field: "Age",
            placeholder: "Enter your age",
          },
          {
            label: "Email",
            type: "email",
            field: "Email",
            placeholder: "Enter your email",
          },
          {
            label: "Phone Number",
            type: "tel",
            field: "PhoneNumber",
            placeholder: "Enter your phone number",
          },
          {
            label: "Address",
            type: "text",
            field: "Address",
            placeholder: "Enter your address",
          },
          {
            label: "Password",
            type: "password",
            field: "Password",
            placeholder: "Enter your password",
          },
        ].map(({ label, type, field, placeholder }) => (
          <div className="mb-3" key={field}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              className="form-control"
              placeholder={placeholder}
              value={register[field] || ""}
              onChange={(e) =>
                usersDetailsChange(
                  field,
                  type === "number" ? Number(e.target.value) : e.target.value
                )
              }
              style={{
                ...inputStyle,
                ...(focusedInput === field ? inputFocusStyle : {}),
              }}
              minLength={field === "Password" ? 8 : undefined}
              onFocus={() => setFocusedInput(field)}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
        ))}

        <div className="mb-3">
          <label style={labelStyle}>Gender</label>
          <select
            className="form-select"
            onChange={(e) => usersDetailsChange("Gender", e.target.value)}
            style={{
              ...inputStyle,
              padding: "9px 14px",
              ...(focusedInput === "Gender" ? inputFocusStyle : {}),
            }}
            onFocus={() => setFocusedInput("Gender")}
            onBlur={() => setFocusedInput(null)}
            value={register.Gender || ""}
          >
            <option value="">-- Select Gender --</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>

        <div className="mb-3">
          <label style={labelStyle}>Role</label>
          <select
            className="form-select"
            onChange={(e) => usersDetailsChange("Role", e.target.value)}
            style={{
              ...inputStyle,
              padding: "9px 14px",
              ...(focusedInput === "Role" ? inputFocusStyle : {}),
            }}
            onFocus={() => setFocusedInput("Role")}
            onBlur={() => setFocusedInput(null)}
            value={register.Role || ""}
          >
            <option value="">-- Select Role --</option>
            <option value="0">Customer</option>
          </select>
        </div>

        {registerStatus.Status === true && (
          <p className="text-success small">✅ {registerStatus.Message}</p>
        )}
        {registerStatus.Status === false && (
          <p className="text-danger small">❌ {registerStatus.Message}</p>
        )}

        <p className="small text-muted">
          By continuing, you agree to our{" "}
          <span style={{ color: "red" }}>Terms</span> and{" "}
          <span style={{ color: "red" }}>Privacy Policy</span>.
        </p>

        <button
          className="btn"
          style={
            isButtonHovered
              ? { ...buttonStyle, ...buttonHoverStyle }
              : buttonStyle
          }
          onClick={submitRegister}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Register
        </button>

        <hr className="my-4" />

        <p className="text-center text-dark" style={{ fontSize: "16px" }}>
          Already registered?{" "}
          <span
            style={{ color: "red", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => setRegisterForm(false)}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
