// frontend/src/components/dashboard/RecentActivity.jsx
import React from "react";
import { getAuthToken } from "../../utils/getAuthToken";
import axios from "axios";

const API_BASE = "http://smart-circular-marketplace-2.onrender.com/api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export default function RecentActivity({ orders, refreshOrders }) {
  const changeStatus = async (orderId, newStatus) => {
    let token;
    try {
      token = await getAuthToken();
    } catch {
      return alert("Login required");
    }

    try {
      await axios.patch(
        `${BACKEND_URL}/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshOrders();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "CONFIRMED":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="recent-activity p-4 bg-gray-900 rounded-xl mt-6">
      <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>

      {orders.length === 0 ? (
        <p className="text-gray-300">No recent activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="p-3 bg-gray-800 rounded-md flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong>Item ID:</strong> {order.item_id} |{" "}
                  <strong>Price:</strong> ₹{order.price}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    order.status
                  )} text-white`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex gap-2">
                {order.status === "PENDING" && (
                  <button
                    className="btn btn ghost"
                    onClick={() => changeStatus(order.id, "CONFIRMED")}
                  >
                    Confirm
                  </button>
                )}
                {order.status === "CONFIRMED" && (
                  <button
                    className="btn btn ghost"
                    onClick={() => changeStatus(order.id, "COMPLETED")}
                  >
                    Complete
                  </button>
                )}
              </div>

              <div className="ids">
                Buyer: {order.buyer_uid} | Seller: {order.seller_uid}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
