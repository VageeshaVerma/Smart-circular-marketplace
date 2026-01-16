// frontend/src/pages/Marketplace.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/items`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      await axios.delete(`${API_BASE}/items/${id}`);
      // remove locally immediately (optimistic)
      setItems(prev => prev.filter(it => it.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    }
  }

  return (
    <div className="marketplace-container">
      <h2 className="marketplace-title">Marketplace</h2>
      {loading ? <p>Loading items...</p> : null}

      {items.length === 0 ? (
        <p>No items yet. Create one via Upload.</p>
      ) : (
        <div className="marketplace-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {items.map((it) => (
            <div key={it.id} className="marketplace-card" style={{ padding: 12 }}>
              {it.image_url ? (
                <img src={it.image_url} alt={it.title} className="marketplace-img" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }} />
              ) : (
                <div className="marketplace-img" style={{ width: "100%", height: 160, borderRadius: 8, background: "#222", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
                  No image
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                <h3 style={{ marginBottom: 4 }}>{it.title}</h3>
                <p className="marketplace-meta" >{it.category} • {it.condition} • {it.age} yrs</p>
                <p className="marketplace-price" >₹{it.price}</p>
                <p className="marketplace-description" >{it.description}</p>

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(window.location.href + `/items/${it.id}`)}>Share</button>
                  <button className="btn ghost" onClick={() => handleDelete(it.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
