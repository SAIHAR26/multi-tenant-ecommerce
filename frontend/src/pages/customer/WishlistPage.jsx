import { useEffect, useState } from "react";
import WishlistCard from "../../components/customer/WishlistCard";
import { getWishlist } from "../../services/wishlistService";

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const data = await getWishlist();
        setWishlistItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load wishlist products. " + (err.message || ""));
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="customer-page"><p className="customer-eyebrow">Loading your wishlist luxury picks...</p></div>
    );
  }

  if (error) {
    return (
      <div className="customer-page"><p className="customer-eyebrow" style={{ color: "red" }}>{error}</p></div>
    );
  }

  /* STEP 7: EMPTY STATE */
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="customer-page">
        <section className="customer-hero customer-hero--compact">
          <div>
            <p className="customer-eyebrow">Wishlist</p>
            <h1>Your wishlist is empty.</h1>
            <p>Save premium items you love here to track availability, price drops, and vendor drops.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Wishlist</p>
          <h1>Your saved luxury picks.</h1>
          <p>Keep track of products you love, price drops, and vendor collections you want to revisit.</p>
        </div>
        <button className="customer-primary-button" type="button">Move All to Cart</button>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div><p className="customer-eyebrow">Saved products</p><h2>Wishlist items</h2></div>
          <span className="customer-pill">{wishlistItems.length} saved</span>
        </div>
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <WishlistCard item={item} key={item._id || item.name} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default WishlistPage;