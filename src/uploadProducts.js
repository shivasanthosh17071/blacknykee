import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Tag, DollarSign, Star, Layers, ImagePlus } from "lucide-react";

function UploadProducts() {
  const navigate = useNavigate();

  const [uploadProduct, setUploadProduct] = useState({
    Title: "",
    Price: "",
    Rating: "",
    Description: "",
    Thumbnail: "",
    Category: "",
  });

  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadProduct({ ...uploadProduct, Thumbnail: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadProduct({ ...uploadProduct, Thumbnail: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProductUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("Title", uploadProduct.Title);
    formData.set("Price", uploadProduct.Price);
    formData.set("Rating", uploadProduct.Rating);
    formData.set("Description", uploadProduct.Description);
    formData.append("Thumbnail", uploadProduct.Thumbnail);
    formData.set("Category", uploadProduct.Category);

    axios
      .post(
        "https://amazon-backend-k8m7.onrender.com/uploadProducts",
        formData,
        {
          headers: { Accept: "multipart/form-data" },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          alert("Product Uploaded Successfully");
          setTimeout(() => navigate("/adminDashboard"), 2000);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "15px",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
        <Upload style={{ verticalAlign: "middle", marginRight: "8px" }} />
        Upload Product
      </h2>
      <form onSubmit={handleProductUpload}>
        {/* Title */}
        <label style={labelStyle}>
          <Tag size={18} style={iconStyle} />
          Title
        </label>
        <input
          required
          placeholder="Product title"
          style={inputStyle}
          onChange={(e) =>
            setUploadProduct({ ...uploadProduct, Title: e.target.value })
          }
        />

        {/* Price */}
        <label style={labelStyle}>
          <DollarSign size={18} style={iconStyle} />
          Price
        </label>
        <input
          required
          type="number"
          placeholder="Enter price"
          style={inputStyle}
          onChange={(e) =>
            setUploadProduct({ ...uploadProduct, Price: e.target.value })
          }
        />

        {/* Rating */}
        <label style={labelStyle}>
          <Star size={18} style={iconStyle} />
          Rating
        </label>
        <select
          required
          style={inputStyle}
          onChange={(e) =>
            setUploadProduct({ ...uploadProduct, Rating: e.target.value })
          }
        >
          <option value="">-- select rating --</option>
          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        {/* Category */}
        <label style={labelStyle}>
          <Layers size={18} style={iconStyle} />
          Category
        </label>
        <select
          required
          style={inputStyle}
          onChange={(e) =>
            setUploadProduct({ ...uploadProduct, Category: e.target.value })
          }
        >
          <option value="">-- select category --</option>
          {[
            "Book",
            "Mobile",
            "Tv",
            "Laptop",
            "Watch",
            "Shoes",
            "Dress",
            "Jewellery",
            "Beauty",
          ].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Description */}
        <label style={labelStyle}>Description</label>
        <textarea
          placeholder="Enter product description"
          style={{ ...inputStyle, height: "80px" }}
          onChange={(e) =>
            setUploadProduct({ ...uploadProduct, Description: e.target.value })
          }
        ></textarea>

        {/* File Upload */}
        <label style={labelStyle}>
          <ImagePlus size={18} style={iconStyle} />
          Product Image
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          style={{
            border: dragActive
              ? "2px dashedrgb(246, 255, 0)"
              : "2px dashed #ccc",
            padding: "40px",
            textAlign: "center",
            borderRadius: "10px",
            backgroundColor: dragActive ? "#f0f8ff" : "#fafafa",
            position: "relative",
            marginBottom: "15px",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById("fileUpload").click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
          ) : (
            <p style={{ color: "#777" }}>
              Drag & drop an image here, or click to select a file
            </p>
          )}
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{
              display: "none",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "  rgb(255, 208, 0)",
            color: "#fff",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Submit Product
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block",
  margin: "15px 0 5px",
  fontWeight: "bold",
  color: "#444",
};

const iconStyle = {
  verticalAlign: "middle",
  marginRight: "6px",
  color: "#555",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "14px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  marginBottom: "10px",
  outline: "none",
};

export default UploadProducts;
