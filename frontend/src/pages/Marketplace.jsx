// frontend/src/pages/Marketplace.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "../utils/getAuthToken";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export default function Marketplace({ refreshOrders }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch all items ---
  async function fetchItems() {
    try {
      setLoading(true);

      let token;
      try {
        token = await getAuthToken(); // fresh token
      } catch {
        token = null; // Not logged in
      }

      const res = await axios.get(`${BACKEND_URL}/api/items`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.status === 401
          ? "Unauthorized. Please login first."
          : "Failed to fetch items."
      );
    } finally {
      setLoading(false);
    }
  }

  // --- Delete an item ---
  async function handleDelete(id) {
    if (!window.confirm("Delete this item permanently?")) return;

    try {
      const token = await getAuthToken(); // fresh token

      await axios.delete(`${BACKEND_URL}/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(prev => prev.filter(it => it.id !== id));
    } catch (err) {
      console.error(err);
      alert(
        err.response?.status === 401
          ? "Unauthorized. Cannot delete item."
          : "Failed to delete item."
      );
    }
  }

  // --- Buy an item ---
  async function handleBuy(itemId) {
    const item = items.find(it => it.id === itemId);
    if (!item) return alert("Item not found.");

    try {
      const token = await getAuthToken(); // fresh token

      const res = await axios.post(
        `${BACKEND_URL}/api/orders`,
        { item_id: itemId, price: item.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Order created! Status: ${res.data.status}`);

      setItems(prev => prev.filter(it => it.id !== itemId));
      if (refreshOrders) refreshOrders();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.status === 401
          ? "Unauthorized. Login required."
          : "Failed to create order."
      );
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="marketplace-container">
      <h2 className="marketplace-title">Marketplace</h2>
      {loading && <p>Loading items...</p>}

      {items.length === 0 ? (
        <p>No items yet. Create one via Upload.</p>
      ) : (
        <div
          className="marketplace-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {items.map(it => (
            <div key={it.id} className="marketplace-card" style={{ padding: 12 }}>
              {it.image_url ? (
                <img
                  src={it.image_url}
                  alt={it.title}
                  className="marketplace-img"
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div
                  className="marketplace-img"
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 8,
                    background: "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  No image
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                <h3 style={{ marginBottom: 4 }}>{it.title}</h3>
                <p className="marketplace-meta">
                  {it.category} • {it.condition} • {it.age} yrs
                </p>
                <p className="marketplace-price">₹{it.price}</p>
                <p className="marketplace-description">{it.description}</p>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <button className="btn btn ghost" onClick={() => handleBuy(it.id)}>Buy</button>
                  <button className="btn btn ghost" onClick={() => handleDelete(it.id)}>Delete</button>
                  <button className="btn btn ghost"
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        window.location.href + `/items/${it.id}`
                      )
                    }
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}