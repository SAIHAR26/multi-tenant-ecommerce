import { useEffect, useState } from "react";
import { getReviews } from "../../services/reviewService";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews("all");

        const reviewsArray = Array.isArray(
          data.reviews
        )
          ? data.reviews
          : Array.isArray(data)
          ? data
          : [];

        setReviews(reviewsArray);
      } catch (err) {
        console.error(err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Loading reviews...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">
            Reviews
          </p>

          <h1>
            Moderate product trust signals.
          </h1>

          <p>
            Track customer feedback and
            marketplace reputation.
          </p>
        </div>
      </section>

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">
                Review queue
              </p>

              <h2>Recent reviews</h2>
            </div>
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
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <tr
                      key={
                        review._id
                      }
                    >
                      <td>
                        {review.product}
                      </td>

                      <td>
                        {review.customer}
                      </td>

                      <td>
                        {review.rating}
                      </td>

                      <td>
                        <span className="status-badge">
                          {review.status ||
                            "Live"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                    >
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ReviewsPage;