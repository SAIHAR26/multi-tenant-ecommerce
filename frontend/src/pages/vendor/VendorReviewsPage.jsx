import { useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getVendorReviews } from "../../services/vendorService";

function VendorReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVendorReviews()
      .then((data) => {
        if (isMounted) {
          setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Reviews could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Customer voice</p>
          <h1>Reviews</h1>
          <span>Monitor ratings, reply with care, and protect store trust.</span>
        </div>
      </section>

      {loading ? <LoadingState message="Loading reviews..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load reviews" message={error} /> : null}
      {!loading && !error && reviews.length === 0 ? (
        <ErrorState title="No reviews" message="No reviews exist for your products yet." />
      ) : null}

      {!loading && !error && reviews.length > 0 ? (
        <section className="vendor-review-grid">
          {reviews.map((review) => (
            <article className="vendor-panel vendor-review-card" key={review._id}>
              <div className="vendor-section-heading">
                <div>
                  <p>{review.productId?.name || "Product"}</p>
                  <h2>{review.userId?.name || "Customer"}</h2>
                </div>
                <span>{Number(review.rating || 0).toFixed(1)}</span>
              </div>
              <p>{review.comment}</p>
              <label className="vendor-field">
                <span>Vendor reply</span>
                <textarea placeholder="Write a thoughtful public reply" />
              </label>
              <button type="button" className="table-action">Send Reply</button>
            </article>
          ))}
        </section>
      ) : null}
    </>
  );
}

export default VendorReviewsPage;
