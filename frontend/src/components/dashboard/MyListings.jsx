export default function MyListings() {
  const listings = [
    { title: "Used Laptop", price: "₹18,000", status: "Active", trend: "↑" },
    { title: "Wooden Chair", price: "₹2,200", status: "Draft", trend: "→" },
    { title: "Mobile Phone", price: "₹6,500", status: "Expired", trend: "↓" },
  ];

  const getTrendClass = (trend) => {
    if (trend === "↑") return "up";
    if (trend === "↓") return "down";
    return "flat";
  };

  return (
    <div className="my-listings">
      <h3>My Listings</h3>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Status</th>
            <th>Trend</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {listings.map((item, i) => (
            <tr key={i}>
              <td className="item-title">{item.title}</td>
              <td>{item.price}</td>

              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>

              <td>
                <span className={`trend ${getTrendClass(item.trend)}`}>
                  {item.trend}
                </span>
              </td>

              <td className="actions">
                <button className="edit">Edit</button>
                <button className="delete">Delete</button>
                <button className="boost">Boost</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
