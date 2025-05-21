import { useState } from "react";
import axios from "axios";
import {
  Upload,
  Tag,
  DollarSign,
  Star,
  Layers,
  ImagePlus,
  FileCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UploadProducts() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    Title: "",
    Price: "",
    Rating: "",
    Category: "",
    Description: "",
    Thumbnail: null,
  });
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, Thumbnail: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, Thumbnail: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post(
        "https://amazon-backend-k8m7.onrender.com/uploadProducts",
        data,
        {
          headers: { Accept: "multipart/form-data" },
        }
      );

      if (res.data.success) {
        alert("Product Uploaded Successfully");
        // Redirect would go here
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="form-group">
              <label className="form-label">
                <Tag size={18} className="icon" /> Title
              </label>
              <input
                required
                name="Title"
                value={formData.Title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Product title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <DollarSign size={18} className="icon" /> Price
              </label>
              <input
                required
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Star size={18} className="icon" /> Rating
              </label>
              <select
                required
                name="Rating"
                value={formData.Rating}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">-- select rating --</option>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <div className="form-group">
              <label className="form-label">
                <Layers size={18} className="icon" /> Category
              </label>
              <select
                required
                name="Category"
                value={formData.Category}
                onChange={handleInputChange}
                className="form-select"
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
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                required
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Enter product description"
                rows={4}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <div className="form-group">
              <label className="form-label">
                <ImagePlus size={18} className="icon" /> Product Image
              </label>
              <div
                className={`image-upload-area ${dragActive ? "active" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDrag}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onClick={() => document.getElementById("fileUpload").click()}
              >
                {preview ? (
                  <div className="preview-container">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      className="image-preview"
                    />
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <ImagePlus size={40} />
                    <p>Drag & drop an image here, or click to select a file</p>
                  </div>
                )}
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-header">
          <h2 className="upload-title">
            <Upload size={22} className="title-icon" />
            Upload Product
          </h2>
          <p className="upload-subtitle">
            Complete all steps to add a new product
          </p>
        </div>

        <div className="stepper">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`step ${currentStep === step ? "active" : ""} ${
                currentStep > step ? "completed" : ""
              }`}
              onClick={() => setCurrentStep(step)}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 ? "Basic Info" : step === 2 ? "Details" : "Image"}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-back"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isSubmitting}
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                className="btn btn-next"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isSubmitting}
              >
                <FileCheck size={16} className="btn-icon" />
                {isSubmitting ? "Submitting..." : "Submit Product"}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        .upload-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .upload-card {
          width: 100%;
          max-width: 720px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          padding: 40px;
          overflow: hidden;
        }

        .upload-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .upload-title {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title-icon {
          margin-right: 10px;
          color: rgb(255, 17, 0);
        }

        .upload-subtitle {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .stepper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          position: relative;
        }

        .stepper::before {
          content: "";
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e5e7eb;
          z-index: 1;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          cursor: pointer;
          flex: 1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: rgb(255, 17, 0);
          // border-color:rgb(255, 17, 0);
          color: white;
        }

        .step.completed .step-number {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }

        .step-label {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .step.active .step-label {
          color: rgb(255, 17, 0);
          font-weight: 600;
        }

        .step-content {
          min-height: 280px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          display: flex;
          align-items: center;
        }

        .icon {
          margin-right: 8px;
          color: rgb(255, 17, 0);
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s;
          background: #f9fafb;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: rgb(255, 17, 0);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: white;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .image-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f9fafb;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-upload-area.active {
          border-color: rgb(255, 17, 0);
          background: rgba(99, 102, 241, 0.05);
        }

        .image-upload-area:hover {
          border-color: rgb(255, 17, 0);
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #6b7280;
        }

        .upload-placeholder svg {
          color: rgb(255, 17, 0);
          margin-bottom: 12px;
          opacity: 0.8;
        }

        .preview-container {
          width: 100%;
        }

        .image-preview {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #f3f4f6;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-size: 15px;
        }

        .btn-back {
          background: #f3f4f6;
          color: #4b5563;
        }

        .btn-back:hover {
          background: #e5e7eb;
        }

        .btn-next {
          background: rgb(255, 17, 0);
          color: white;
          padding: 10px 24px;
        }

        .btn-next:hover {
          background: #4f46e5;
        }

        .btn-submit {
          background: #10b981;
          color: white;
          padding: 10px 24px;
        }

        .btn-submit:hover {
          background: #059669;
        }

        .btn-submit:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-icon {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
}
