import { PRODUCT_IMAGE_FALLBACK } from "../../utils/productImages";

function RecommendationCard({ item }) {
  return (
    <article className="recommendation-card">
      <img src={item.image || PRODUCT_IMAGE_FALLBACK} alt={item.title} />
      <div>
        <p className="customer-eyebrow">{item.reason}</p>
        <h3>{item.title}</h3>
        <span>{item.count} curated products</span>
      </div>
    </article>
  );
}

export default RecommendationCard;
