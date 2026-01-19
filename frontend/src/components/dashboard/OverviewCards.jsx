// frontend/src/components/dashboard/OverviewCards.jsx
import React from "react";

export default function OverviewCards({ orders = [] }) {
  // 📊 Derived Metrics
  const totalSold = orders.length;
  const totalCompleted = orders.filter((o) => o.status === "COMPLETED").length;
  const co2Saved = totalCompleted * 2; // mock sustainability logic
  const totalEarnings = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.price, 0); // ✅ dynamic earnings from backend

  const stats = [
    {
      title: "Items Sold",
      value: totalSold,
      icon: "🛒",
    },
    {
      title: "Orders Completed",
      value: totalCompleted,
      icon: "✅",
    },
    {
      title: "CO₂ Saved",
      value: `${co2Saved} kg`,
      icon: "🌱",
    },
    {
      title: "Total Earnings",
      value: `₹${totalEarnings}`,
      icon: "💰",
    },
  ];

  return (
    <div className="overview-cards">
      {stats.map((s, i) => (
        <div key={i} className="overview-card">
          <div className="overview-icon">{s.icon}</div>
          <div className="overview-title">{s.title}</div>
          <div className="overview-value">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
