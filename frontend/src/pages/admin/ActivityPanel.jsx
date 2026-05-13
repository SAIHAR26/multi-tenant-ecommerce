const activities = [
  {
    title: "Vendor added product",
    detail: "Urban Vault published Matte Utility Jacket.",
    time: "8 min ago",
  },
  {
    title: "Customer placed order",
    detail: "Anaya Rao completed checkout from Luxe Lane.",
    time: "18 min ago",
  },
  {
    title: "Payment received",
    detail: "₹1,02,920 settled through V SHOP Payments.",
    time: "32 min ago",
  },
  {
    title: "Vendor review approved",
    detail: "Redline Studio passed quality verification.",
    time: "1 hr ago",
  },
];

function ActivityPanel() {
  return (
    <article className="glass-panel activity-panel">
      <div className="panel-header">
        <div>
          <p className="admin-eyebrow">Recent activities</p>
          <h2>Operations pulse</h2>
        </div>
      </div>

      <div className="activity-list">
        {activities.map((activity) => (
          <div className="activity-item" key={activity.title + activity.time}>
            <span className="activity-dot" />
            <div>
              <h3>{activity.title}</h3>
              <p>{activity.detail}</p>
              <time>{activity.time}</time>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ActivityPanel;
