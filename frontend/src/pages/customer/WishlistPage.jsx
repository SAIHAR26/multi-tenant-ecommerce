import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { useToast } from "../../components/useToast";
import WishlistCard from "../../components/customer/WishlistCard";
import { addToCart } from "../../services/cartService";
import { getWishlist, removeFromWishlist } from "../../services/wishlistService";

const getItemId = (item) => 
  item?._id || 
  item?.id || 
  item?.productId || 
  item?.product?._id || 
  item?.product?.id;

function WishlistPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchWishlist() {
      try {
        const data = await getWishlist();
        if (isMounted) {
          setWishlistItems(Array.isArray(data) ? data : []);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load wishlist");
          setLoading(false);
        }
      }
    }

    fetchWishlist();
    return () => {
      isMounted = false;
    };
  }, []);

  const removeLocalItem = (itemToRemove) => {
    const itemId = getItemId(itemToRemove);
    setWishlistItems((items) => items.filter((item) => getItemId(item) !== itemId));
  };

  const handleRemove = async (item) => {
    const id = getItemId(item);
    if (!id) {
      showToast({ message: "Invalid item ID", type: "error" });
      return;
    }
    try {
      await removeFromWishlist(id);
      removeLocalItem(item);
      showToast({ message: "Item removed from wishlist", type: "success" });
    } catch (err) {
      showToast({ message: err.message || "Unable to remove wishlist item", type: "error" });
    }
  };

  const handleMoveToCart = async (item) => {
    const id = getItemId(item);
    if (!id) {
      showToast({ message: "Invalid item reference", type: "error" });
      return;
    }
    try {
      await addToCart(item.product || item);
      await removeFromWishlist(id);
      removeLocalItem(item);
      showToast({ message: "Item moved to cart", type: "success" });
    } catch (err) {
      showToast({ message: err.message || "Unable to move item to cart", type: "error" });
    }
  };

  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    try {
      for (const item of wishlistItems) {
        await addToCart(item.product || item);
        await removeFromWishlist(getItemId(item));
      }
      setWishlistItems([]);
      showToast({ message: "All items moved to cart successfully", type: "success" });
    } catch (err) {
      showToast({ message: "Error moving items to cart", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="customer-page">
        <LoadingState message="Loading wishlist..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-page">
        <ErrorState title="Unable to load wishlist" message={error} />
      </div>
    );
  }

  // EMPTY WISHLIST STATE
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="customer-page">
        <section className="customer-hero customer-hero--compact">
          <div style={{ textAlign: "center", padding: "40px 20px", width: "100%" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>❤️</div>
            <h1 style={{ marginBottom: "8px" }}>Your Wishlist is lonely</h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Tap the heart icon on any product while browsing to save your favorites here.
            </p>
            <button
              onClick={() => navigate("/customer")}
              className="customer-secondary-button"
              type="button"
              style={{ padding: "10px 24px", border: "1px solid black", cursor: "pointer" }}
            >
              Go to Marketplace
            </button>
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
        <button className="customer-primary-button" type="button" onClick={handleMoveAllToCart}>
          Move All to Cart
        </button>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div><p className="customer-eyebrow">Saved products</p><h2>Wishlist items</h2></div>
          <span className="customer-pill">{wishlistItems.length} saved</span>
        </div>
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <WishlistCard
              item={item}
              key={getItemId(item) || item?.name || Math.random()}
              onMoveToCart={handleMoveToCart}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default WishlistPage;