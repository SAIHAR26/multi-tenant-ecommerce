function DashboardCard({ title, value, change, note, tone }) {
  return (
    <article className={`dashboard-card dashboard-card--${tone}`}>
      <div className="dashboard-card__top">
        <span>{title}</span>
        <strong>{change}</strong>
      </div>
      <h2>{value}</h2>
      <p>{note}</p>
    </article>
  );
}

export default DashboardCard;
