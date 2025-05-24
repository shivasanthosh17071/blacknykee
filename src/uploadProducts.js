"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "./config/api";

function UploadProducts() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploadProduct, setUploadProduct] = useState({
    Title: "",
    Price: "",
    Rating: "",
    Description: "",
    Thumbnail: null,
    Category: "",
    previewImage: null,
  });

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const validateStep = (currentStep) => {
    const { Title, Price, Rating, Description, Category, Thumbnail } =
      uploadProduct;
    if (currentStep === 1 && (!Title || !Price)) return false;
    if (currentStep === 2 && (!Rating || !Category)) return false;
    if (currentStep === 3 && (!Description || !Thumbnail)) return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const formData = new FormData();
    Object.entries(uploadProduct).forEach(([key, value]) =>
      key === "Thumbnail"
        ? formData.append(key, value)
        : formData.set(key, value)
    );

    axios
      .post(`${BASE_URL}/uploadProducts`, formData, {
        headers: { Accept: "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.success) {
          alert("Product Uploaded Successfully");
          setTimeout(() => navigate("/adminDashboard"), 2000);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "",
        background:
          "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          .upload-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid #e0e0e0;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.8s ease-out;
          }
          
          .step-indicator {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            border-radius: 15px;
            transition: all 0.3s ease;
          }
          
          .step-content {
            animation: slideIn 0.5s ease-out;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
          }
          
          .btn-next {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            border: none;
            transition: all 0.3s ease;
            border-radius: 10px;
          }
          
          .btn-next:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(220, 53, 69, 0.4);
          }
          
          .btn-back {
            border: 2px solid #6c757d;
            transition: all 0.3s ease;
            border-radius: 10px;
          }
          
          .btn-back:hover {
            background: #6c757d;
            color: white;
            transform: translateY(-2px);
          }
          
          .btn-upload {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border: none;
            transition: all 0.3s ease;
            border-radius: 10px;
            animation: pulse 2s infinite;
          }
          
          .btn-upload:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(40, 167, 69, 0.4);
          }
          
          .preview-image {
            border: 3px solid #dc3545;
            border-radius: 15px;
            transition: all 0.3s ease;
          }
          
          .preview-image:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(220, 53, 69, 0.3);
          }
          
          .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin: 0 auto 10px;
          }
          
          .step-number.active {
            animation: pulse 1.5s infinite;
          }
        `}
      </style>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card upload-card shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-danger">
                  <i className="bi bi-cloud-upload me-2"></i>
                  Upload New Product
                </h4>
                <p className="text-muted">
                  Add your product details step by step
                </p>
              </div>

              {/* Step Indicator */}
              <div className="mb-5">
                <div
                  className="progress step-indicator"
                  style={{ height: "12px" }}
                >
                  <div
                    className="progress-bar bg-white"
                    style={{
                      width: `${(step / 3) * 100}%`,
                      transition: "width 0.5s ease",
                    }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <div className="text-center">
                    <div className={`step-number ${step >= 1 ? "active" : ""}`}>
                      1
                    </div>
                    <small
                      className={
                        step >= 1 ? "text-danger fw-bold" : "text-muted"
                      }
                    >
                      Basic Info
                    </small>
                  </div>
                  <div className="text-center">
                    <div className={`step-number ${step >= 2 ? "active" : ""}`}>
                      2
                    </div>
                    <small
                      className={
                        step >= 2 ? "text-danger fw-bold" : "text-muted"
                      }
                    >
                      Details
                    </small>
                  </div>
                  <div className="text-center">
                    <div className={`step-number ${step >= 3 ? "active" : ""}`}>
                      3
                    </div>
                    <small
                      className={
                        step >= 3 ? "text-danger fw-bold" : "text-muted"
                      }
                    >
                      Media
                    </small>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1 */}
                {step === 1 && (
                  <div className="step-content">
                    <h5 className="text-danger mb-4">
                      <i className="bi bi-info-circle me-2"></i>
                      Basic Information
                    </h5>
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter product title"
                        required
                        value={uploadProduct.Title}
                        onChange={(e) =>
                          setUploadProduct({
                            ...uploadProduct,
                            Title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Price (₹) *</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0.00"
                          required
                          value={uploadProduct.Price}
                          onChange={(e) =>
                            setUploadProduct({
                              ...uploadProduct,
                              Price: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="step-content">
                    <h5 className="text-danger mb-4">
                      <i className="bi bi-gear me-2"></i>
                      Product Details
                    </h5>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Rating *</label>
                      <select
                        className="form-select form-select-lg"
                        required
                        value={uploadProduct.Rating}
                        onChange={(e) =>
                          setUploadProduct({
                            ...uploadProduct,
                            Rating: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Select Rating --</option>
                        {[
                          1, 1.5, 2, 2.5, 3, 3.5, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5,
                        ].map((r) => (
                          <option key={r} value={r}>
                            {r} ⭐
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Category *</label>
                      <select
                        className="form-select form-select-lg"
                        required
                        value={uploadProduct.Category}
                        onChange={(e) =>
                          setUploadProduct({
                            ...uploadProduct,
                            Category: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Select Category --</option>
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
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="step-content">
                    <h5 className="text-danger mb-4">
                      <i className="bi bi-image me-2"></i>
                      Description & Media
                    </h5>
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Description *
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Describe your product in detail..."
                        required
                        value={uploadProduct.Description}
                        onChange={(e) =>
                          setUploadProduct({
                            ...uploadProduct,
                            Description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Product Image *
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-lg"
                        accept="image/*"
                        required
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setUploadProduct({
                            ...uploadProduct,
                            Thumbnail: file,
                            previewImage: URL.createObjectURL(file),
                          });
                        }}
                      />
                    </div>

                    {uploadProduct.Thumbnail && (
                      <div className="text-center mb-4">
                        <p className="mb-3 text-muted fw-bold">
                          <i className="bi bi-eye me-1"></i>
                          Preview:
                        </p>
                        <img
                          src={uploadProduct.previewImage || "/placeholder.svg"}
                          alt="Preview"
                          className="preview-image"
                          style={{ maxWidth: "250px", height: "auto" }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-5">
                  {step > 1 && (
                    <button
                      type="button"
                      className="btn btn-back px-4 py-2"
                      onClick={handleBack}
                    >
                      <i className="bi bi-arrow-left me-1"></i>
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      className="btn btn-next text-white px-4 py-2 ms-auto"
                      onClick={handleNext}
                    >
                      Next
                      <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-upload text-white px-5 py-2 ms-auto fw-bold"
                    >
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload Product
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadProducts;
