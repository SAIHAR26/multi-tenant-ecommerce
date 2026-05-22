import { useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import ProductCard from "../../components/customer/ProductCard";
import RecommendationCard from "../../components/customer/RecommendationCard";
import { getRecommendations } from "../../services/recommendationService";

function RecommendationsPage() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applyRecommendations = (data) => {
    setRecommendedProducts(data.products || []);
    setCategories(data.categories || []);
    setError("");
  };

  const handleRecommendationError = (err) => {
    setError("Unable to process personalized feed engine. " + (err.message || ""));
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecommendations();
      applyRecommendations(data);
    } catch (err) {
      handleRecommendationError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getRecommendations()
      .then((data) => {
        if (isMounted) {
          applyRecommendations(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          handleRecommendationError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="customer-page">
        <LoadingState message="Loading recommendations..." />
      </div>
    );
  }

  if (error && recommendedProducts.length === 0 && categories.length === 0) {
    return (
      <div className="customer-page">
        <ErrorState
          title="Unable to load recommendations"
          message={error}
          actionLabel="Refresh Picks"
          onAction={fetchRecommendations}
        />
      </div>
    );
  }

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Recommendations</p>
          <h1>Curated products for your taste.</h1>
          <p>Explore premium categories, favorite vendors, and products selected from your shopping signals.</p>
          {error && <small style={{ color: "orange", display: "block", marginTop: "8px" }}>{error}</small>}
        </div>
        <button className="customer-primary-button" type="button" onClick={fetchRecommendations}>
          Refresh Picks
        </button>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div><p className="customer-eyebrow">Favorite categories</p><h2>Shopping lanes</h2></div>
        </div>
        {categories.length === 0 ? (
          <div style={{ padding: "20px 0" }}>
            <p style={{ opacity: 0.7, fontStyle: "italic" }}>No category affinities recorded yet. Keep browsing to populate your personal lanes.</p>
          </div>
        ) : (
          <div className="recommendation-grid">
            {categories.map((item) => (
              <RecommendationCard item={item} key={item.title || item._id} />
            ))}
          </div>
        )}
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div><p className="customer-eyebrow">Recommended products</p><h2>Made for your next cart</h2></div>
        </div>
        {recommendedProducts.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <p style={{ opacity: 0.8 }}>No explicit product recommendations calculated. Check back after adding premium items to your wishlist.</p>
          </div>
        ) : (
          <div className="customer-product-grid">
            {recommendedProducts.map((product) => (
              <ProductCard product={product} key={product.name || product._id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RecommendationsPage;
