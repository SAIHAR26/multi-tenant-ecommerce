import { useEffect, useMemo, useState } from "react";
import { getReviews } from "../../services/reviewService";

const getProductName = (review) =>
  review.productId?.name || review.product || "No Product";

const getCustomerName = (review) =>
  review.userId?.name || review.customer || "No Customer";

const getStatus = (review) => review.status || "Live";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getReviews("all")
      .then((data) => {
        if (!isMounted) return;

        setReviews(
          Array.isArray(data.reviews)
            ? data.reviews
            : Array.isArray(data)
            ? data
            : []
        );
        setError("");
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Failed to load reviews");
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

  const averageRating = useMemo(() => {
    if (!reviews.length) return "0.0";

    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const lowRatingCount = reviews.filter((review) => Number(review.rating || 0) <= 2).length;
  const responseReadyCount = reviews.filter((review) => review.userId?.email).length;

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Reviews</p>
          <h1>Moderate product trust signals.</h1>
          <p>Track customer feedback, review quality, and marketplace reputation across vendors.</p>
        </div>
        <button className="hero-action" type="button">Moderate Reviews</button>
      </section>

      {loading ? <div className="notification-state">Loading reviews...</div> : null}
      {error ? <p className="admin-action-status admin-action-status--error">{error}</p> : null}

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Review queue</p>
              <h2>Recent reviews</h2>
            </div>
            <span className="panel-pill">{averageRating} avg</span>
          </div>

          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {!loading && !error && reviews.length > 0 ? (
                  reviews.map((review) => {
                    const status = getStatus(review);

                    return (
                      <tr key={review._id || `${getProductName(review)}-${getCustomerName(review)}`}>
                        <td>{getProductName(review)}</td>
                        <td>{getCustomerName(review)}</td>
                        <td>{Number(review.rating || 0).toFixed(1)}</td>
                        <td>
                          <span className={`status-badge status-badge--${status.toLowerCase()}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : null}

                {!loading && !error && reviews.length === 0 ? (
                  <tr>
                    <td colSpan="4">No reviews found</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Sentiment</p>
              <h2>Trust health</h2>
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-dot" />
              <div>
                <h3>Positive mentions</h3>
                <p>Average marketplace review score from live customer feedback.</p>
                <time>{averageRating}/5</time>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-dot" />
              <div>
                <h3>Needs review</h3>
                <p>Low-rating reviews flagged for admin attention.</p>
                <time>{lowRatingCount}</time>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-dot" />
              <div>
                <h3>Customer context</h3>
                <p>Reviews with customer email available for follow-up.</p>
                <time>{responseReadyCount}</time>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ReviewsPage;
