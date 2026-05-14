function RecommendationCard({ item }) {
  return (
    <article className="recommendation-card">
      <img src={item.image} alt={item.title} />
      <div>
        <p className="customer-eyebrow">{item.reason}</p>
        <h3>{item.title}</h3>
        <span>{item.count} curated products</span>
      </div>
    </article>
  );
}

export default RecommendationCard;
