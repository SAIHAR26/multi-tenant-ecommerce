const reviews = [
  { name: "Ira Kapoor", rating: "5.0", product: "Crimson Luxe Jacket", text: "Beautiful finish, premium packaging, and fast shipping." },
  { name: "Dev Rao", rating: "4.8", product: "Matte Steel Watch", text: "Looks excellent in person. Strap adjustment was simple." },
  { name: "Sara Khan", rating: "4.6", product: "Signature Leather Tote", text: "Elegant build and rich texture. Would love more color options." },
];

function VendorReviewsPage() {
  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Customer voice</p>
          <h1>Reviews</h1>
          <span>Monitor ratings, reply with care, and protect store trust.</span>
        </div>
      </section>

      <section className="vendor-review-grid">
        {reviews.map((review) => (
          <article className="vendor-panel vendor-review-card" key={review.name}>
            <div className="vendor-section-heading">
              <div>
                <p>{review.product}</p>
                <h2>{review.name}</h2>
              </div>
              <span>{review.rating}</span>
            </div>
            <p>{review.text}</p>
            <label className="vendor-field">
              <span>Vendor reply</span>
              <textarea placeholder="Write a thoughtful public reply" />
            </label>
            <button type="button" className="table-action">Send Reply</button>
          </article>
        ))}
      </section>
    </>
  );
}

export default VendorReviewsPage;
