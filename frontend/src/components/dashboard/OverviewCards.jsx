export default function OverviewCards() {
  const stats = [
    { title: "Items Sold / Bought", value: "18 / 25", icon: "♻️" },
    { title: "Total Earnings / Savings", value: "₹8,400", icon: "💰" },
    { title: "CO₂ Saved", value: "42 kg", icon: "🌱" },
    { title: "Items Reused / Repaired", value: "31", icon: "🔁" },
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
