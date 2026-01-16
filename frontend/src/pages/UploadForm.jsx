// frontend/src/pages/UploadForm.jsx
import React, { useState } from "react";
import axios from "axios";


const API_BASE = "http://localhost:8000/api";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  function onImageChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  }

  const isValidForPredict = () => category && condition && age !== "";
  const isValidForCreate = () => title && category && condition && age !== "";

  async function handlePredict(e) {
    e.preventDefault();
    if (!isValidForPredict()) {
      alert("Please fill category, condition, and age for prediction.");
      return;
    }
    try {
      setLoading(true);
      const payload = { category, condition, age: Number(age) };
      const res = await axios.post(`${API_BASE}/ai/predict`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateListing(e) {
    e.preventDefault();
    if (!isValidForCreate()) {
      alert("Please fill all required fields before creating listing.");
      return;
    }
    try {
      setLoading(true);
      const form = new FormData();
      form.append("title", title);
      form.append("category", category);
      form.append("age", Number(age));
      form.append("condition", condition);
      form.append("description", description || "");
      if (imageFile) form.append("image", imageFile);

      const res = await axios.post(`${API_BASE}/items`, form);
      alert(`Listing created. Price: ₹${res.data.price}`);

      // reset form
      setTitle("");
      setCategory("");
      setAge("");
      setCondition("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setPrediction(null);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Create listing failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-wrap">
        <div className="upload-card" role="region" aria-label="Upload item">
          <div className="upload-card-left">
            <h2 className="upload-title">Upload Item & AI Suggestion</h2>

            <form className="upload-form" onSubmit={handlePredict}>

              <label className="field-label">Title</label>
              <input
                className="field-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter item title"
                aria-label="title"
              />

              <label className="field-label">Category</label>
              <select
                className="field-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="category"
              >
                <option value="" disabled hidden>Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="appliance">Appliance</option>
                <option value="other">Other</option>
              </select>

              <label className="field-label">Condition</label>
              <select
                className="field-input"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                aria-label="condition"
              >
                <option value="" disabled hidden>Select Condition</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>

              <label className="field-label">Age (years)</label>
              <input
                className="field-input"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 2"
                min="0"
                aria-label="age"
              />

              <label className="field-label">Description (optional)</label>
              <textarea
                className="field-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                rows={4}
              />

              <div className="file-row">
                <div>
                  <label className="field-label">Upload Image (optional)</label>
                  <input className="file-input" type="file" accept="image/*" onChange={onImageChange} />
                </div>

                <div className="action-buttons">
                  <button className={`btn primary ${loading ? "btn-disabled" : ""}`} type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Get AI Suggestion"}
                  </button>

                  <button
                    className={`btn ghost ${loading ? "btn-disabled" : ""}`}
                    type="button"
                    onClick={handleCreateListing}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Listing"}
                  </button>
                </div>
              </div>

            </form>

            {prediction && (
              <div className="prediction">
                <div><strong>Recommendation:</strong> {prediction.recommendation}</div>
                <div><strong>Predicted Price:</strong> ₹{prediction.predicted_price}</div>
              </div>
            )}
          </div>

          <aside className="upload-card-right" aria-hidden>
            <div className="preview-wrap">
              {imagePreview ? (
                <img className="upload-preview" src={imagePreview} alt="preview" />
              ) : (
                <div className="upload-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3v14" stroke="#8fa6c4" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M5 12h14" stroke="#8fa6c4" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="placeholder-text">No image selected</div>
                </div>
              )}
            </div>

            <div className="tip-box">
              <h4>Quick Tips</h4>
              <ul>
                <li>Use clear photos (well-lit, single item).</li>
                <li>Mention defects in description for accurate pricing.</li>
                <li>Choose correct category and condition.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
