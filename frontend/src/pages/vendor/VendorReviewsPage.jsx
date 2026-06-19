import { useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getVendorReviews, replyToVendorReview } from "../../services/vendorService";

function VendorReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [draftReplies, setDraftReplies] = useState({});
  const [savingReplyId, setSavingReplyId] = useState("");
  const [replyStatus, setReplyStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVendorReviews()
      .then((data) => {
        if (isMounted) {
          setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
          setDraftReplies(
            Object.fromEntries(
              (Array.isArray(data?.reviews) ? data.reviews : []).map((review) => [
                review._id,
                review.vendorReply?.text || "",
              ])
            )
          );
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

  const handleReplyChange = (reviewId, value) => {
    setDraftReplies((current) => ({ ...current, [reviewId]: value }));
    setReplyStatus((current) => ({ ...current, [reviewId]: "" }));
  };

  const handleReplySubmit = async (reviewId) => {
    const reply = String(draftReplies[reviewId] || "").trim();

    if (!reply) {
      setReplyStatus((current) => ({ ...current, [reviewId]: "Write a reply before sending." }));
      return;
    }

    try {
      setSavingReplyId(reviewId);
      const data = await replyToVendorReview(reviewId, reply);
      setReviews((current) =>
        current.map((review) => (review._id === reviewId ? data.review || review : review))
      );
      setDraftReplies((current) => ({ ...current, [reviewId]: data.review?.vendorReply?.text || reply }));
      setReplyStatus((current) => ({ ...current, [reviewId]: "Reply saved." }));
    } catch (err) {
      setReplyStatus((current) => ({
        ...current,
        [reviewId]: err.message || "Reply could not be saved.",
      }));
    } finally {
      setSavingReplyId("");
    }
  };

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
                <textarea
                  placeholder="Write a thoughtful public reply"
                  value={draftReplies[review._id] || ""}
                  onChange={(event) => handleReplyChange(review._id, event.target.value)}
                />
              </label>
              {review.vendorReply?.repliedAt ? (
                <span className="vendor-muted">
                  Last replied {new Date(review.vendorReply.repliedAt).toLocaleDateString("en-IN")}
                </span>
              ) : null}
              {replyStatus[review._id] ? <span className="vendor-muted">{replyStatus[review._id]}</span> : null}
              <button
                type="button"
                className="table-action"
                disabled={savingReplyId === review._id}
                onClick={() => handleReplySubmit(review._id)}
              >
                {savingReplyId === review._id ? "Sending..." : "Send Reply"}
              </button>
            </article>
          ))}
        </section>
      ) : null}
    </>
  );
}

export default VendorReviewsPage;
