import {
  useEffect,
  useState,
} from "react";

import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";

import ProductCard from "../../components/customer/ProductCard";
import RecommendationCard from "../../components/customer/RecommendationCard";

import { getRecommendations } from "../../services/recommendationService";

function RecommendationsPage() {
  const [
    recommendedProducts,
    setRecommendedProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // FETCH RECOMMENDATIONS
  const fetchRecommendations =
    async () => {
      try {
        setLoading(true);

        const data =
          await getRecommendations();

        setRecommendedProducts(
          data?.products || []
        );

        setCategories(
          data?.categories || []
        );

        setError("");
      } catch (err) {
        setError(
          err.message ||
            "Unable to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

  // INITIAL LOAD
  useEffect(() => {
    let isMounted = true;

    async function loadRecommendations() {
      try {
        setLoading(true);

        const data =
          await getRecommendations();

        if (!isMounted) return;

        setRecommendedProducts(
          data?.products || []
        );

        setCategories(
          data?.categories || []
        );

        setError("");
      } catch (err) {
        if (isMounted) {
          setError(
            err.message ||
              "Unable to load recommendations."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  // LOADING STATE
  if (loading) {
    return (
      <div className="customer-page">
        <LoadingState message="Loading personalized recommendations..." />
      </div>
    );
  }

  // FULL ERROR STATE
  if (
    error &&
    recommendedProducts.length ===
      0 &&
    categories.length === 0
  ) {
    return (
      <div className="customer-page">
        <ErrorState
          title="Recommendations unavailable"
          message={error}
          actionLabel="Retry"
          onAction={
            fetchRecommendations
          }
        />
      </div>
    );
  }

  return (
    <div className="customer-page">
      {/* HERO */}
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">
            Recommendations
          </p>

          <h1>
            Curated products for
            your taste.
          </h1>

          <p>
            Explore premium
            categories, favorite
            vendors, and products
            selected from your
            shopping signals.
          </p>

          {error ? (
            <small
              style={{
                color: "orange",
                display: "block",
                marginTop: "8px",
              }}
            >
              {error}
            </small>
          ) : null}
        </div>

        <button
          className="customer-primary-button"
          type="button"
          onClick={
            fetchRecommendations
          }
        >
          Refresh Picks
        </button>
      </section>

      {/* CATEGORIES */}
      <section className="customer-panel">
        <div className="customer-panel__header">
          <div>
            <p className="customer-eyebrow">
              Favorite categories
            </p>

            <h2>
              Shopping lanes
            </h2>
          </div>
        </div>

        {categories.length ===
        0 ? (
          <div
            style={{
              padding: "24px 0",
            }}
          >
            <p
              style={{
                opacity: 0.7,
                fontStyle:
                  "italic",
              }}
            >
              No category
              affinities detected
              yet. Browse products
              to improve your
              personalized feed.
            </p>
          </div>
        ) : (
          <div className="recommendation-grid">
            {categories.map(
              (item) => (
                <RecommendationCard
                  key={
                    item?._id ||
                    item?.title
                  }
                  item={item}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* PRODUCTS */}
      <section className="customer-panel">
        <div className="customer-panel__header">
          <div>
            <p className="customer-eyebrow">
              Recommended products
            </p>

            <h2>
              Made for your next
              cart
            </h2>
          </div>
        </div>

        {recommendedProducts.length ===
        0 ? (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                opacity: 0.8,
              }}
            >
              No personalized
              products available
              yet. Add products to
              your wishlist and
              continue shopping to
              improve
              recommendations.
            </p>
          </div>
        ) : (
          <div className="customer-product-grid">
            {recommendedProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product?._id ||
                    product?.id ||
                    product?.name
                  }
                  product={product}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default RecommendationsPage;