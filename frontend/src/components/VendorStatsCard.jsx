function VendorStatsCard({ label, value, trend, icon }) {
  return (
    <article className="vendor-stat-card">
      <div className="vendor-stat-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{trend}</span>
      </div>
    </article>
  );
}

export default VendorStatsCard;
