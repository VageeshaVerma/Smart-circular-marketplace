export default function RecentActivity() {
  const activities = [
    { action: "Order placed", status: "Pending" },
    { action: "Message from buyer", status: "New" },
    { action: "Item shipped", status: "Completed" },
  ];

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>

      <ul>
        {activities.map((a, i) => (
          <li key={i}>
            <span>{a.action}</span>
            <span className={`status ${a.status}`}>{a.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
