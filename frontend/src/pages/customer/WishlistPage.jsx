import { useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { useToast } from "../../components/useToast";
import WishlistCard from "../../components/customer/WishlistCard";
import { addToCart } from "../../services/cartService";
import { getWishlist, removeFromWishlist } from "../../services/wishlistService";

const getItemId = (item) => item._id || item.id || item.productId || item.product?._id;

function WishlistPage() {
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
          setWishlistItems(data);
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
    try {
      await removeFromWishlist(getItemId(item));
      removeLocalItem(item);
      showToast("Item removed from wishlist");
    } catch (err) {
      showToast(err.message || "Unable to remove wishlist item", "error");
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      await addToCart(item.product || item);
      await removeFromWishlist(getItemId(item));
      removeLocalItem(item);
      showToast("Item moved to cart");
    } catch (err) {
      showToast(err.message || "Unable to move item to cart", "error");
    }
  };

  const handleMoveAllToCart = async () => {
    for (const item of wishlistItems) {
      await handleMoveToCart(item);
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
              key={getItemId(item) || item.name}
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
