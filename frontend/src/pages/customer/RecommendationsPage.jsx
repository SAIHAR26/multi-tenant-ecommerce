import ProductCard from "../../components/customer/ProductCard";
import RecommendationCard from "../../components/customer/RecommendationCard";
import { products, recommendations } from "./customerData";

function RecommendationsPage() {
  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Recommendations</p>
          <h1>Curated products for your taste.</h1>
          <p>Explore premium categories, favorite vendors, and products selected from your shopping signals.</p>
        </div>
        <button className="customer-primary-button" type="button">Refresh Picks</button>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div><p className="customer-eyebrow">Favorite categories</p><h2>Shopping lanes</h2></div>
        </div>
        <div className="recommendation-grid">
          {recommendations.map((item) => (
            <RecommendationCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div><p className="customer-eyebrow">Recommended products</p><h2>Made for your next cart</h2></div>
        </div>
        <div className="customer-product-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.name} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default RecommendationsPage;
