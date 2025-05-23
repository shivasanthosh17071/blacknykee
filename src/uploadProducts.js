import React, { useState } from "react";
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
    previewImage: null, // <-- Add this
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
    <div className="container py-5" style={{ minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm rounded-4">
            <div className="card-body p-4">
              <h4 className="text-center mb-4 text-primary">Upload Product</h4>

              {/* Step Indicator */}
              <div className="mb-4">
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className={step >= 1 ? "text-success" : "text-muted"}>
                    Step 1
                  </small>
                  <small className={step >= 2 ? "text-success" : "text-muted"}>
                    Step 2
                  </small>
                  <small className={step >= 3 ? "text-success" : "text-muted"}>
                    Step 3
                  </small>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
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
                    <div className="mb-3">
                      <label className="form-label">Price ($) *</label>
                      <input
                        type="number"
                        className="form-control"
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
                  </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Rating *</label>
                      <select
                        className="form-select"
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
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
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
                  </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-control"
                        rows="3"
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

                    <div className="mb-3">
                      <label className="form-label">Thumbnail Image *</label>
                      <input
                        type="file"
                        className="form-control"
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
                      <div className="text-center">
                        <p className="mb-1 text-muted">Preview:</p>
                        <img
                          src={uploadProduct.previewImage}
                          alt="Preview"
                          className="img-thumbnail rounded"
                          style={{ maxWidth: "200px", height: "auto" }}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between">
                  {step > 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      className="btn btn-primary ms-auto"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-success ms-auto">
                      Upload
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
