import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import { useToast } from "../../components/useToast";
import { getCartItems, removeFromCart } from "../../services/cartService";
import { getProductImage } from "../../utils/productImages";
import { calculateOrderTotals, formatPrice, getLineDiscount } from "../../utils/orderTotals";

const getItemId = (item) => String(item?._id || item?.id || item?.productId || item?.product?._id || "");
const getProduct = (item) => item?.product || item || {};
const getSellerName = (product) =>
  product?.storeId?.storeName ||
  product?.vendor?.name ||
  product?.vendor?.storeName ||
  product?.brand ||
  "V SHOP";

function CartPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCart() {
      try {
        const data = await getCartItems();
        if (isMounted) {
          setCartItems(data);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load cart");
          setLoading(false);
        }
      }
    }

    fetchCart();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      setCartItems((prev) => prev.filter((item) => getItemId(item) !== String(id)));
      showToast("Item removed from cart");
    } catch (err) {
      showToast(err.message || "Could not remove item. Try again.", "error");
    }
  };

  const totals = calculateOrderTotals(cartItems);

  if (loading) {
    return (
      <div className="customer-page">
        <LoadingState message="Loading cart..." />
      </div>
    );
  }

  if (error) {
    const needsLogin = error.toLowerCase().includes("session expired");

    return (
      <div className="customer-page">
        <section className="customer-hero customer-hero--compact">
          <div>
            <p className="customer-eyebrow">Cart access</p>
            <h1>{needsLogin ? "Please login to view your cart." : "Unable to load cart"}</h1>
            <p>
              {needsLogin
                ? "Your previous session is no longer valid. Login as customer again and your database cart will load."
                : error}
            </p>
          </div>
          <button
            className="customer-primary-button"
            type="button"
            onClick={() => navigate(needsLogin ? "/login" : "/customer")}
          >
            {needsLogin ? "Login" : "Browse Products"}
          </button>
        </section>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="customer-page">
        <section className="customer-hero customer-hero--compact">
          <div>
            <p className="customer-eyebrow">Cart Status</p>
            <h1>Your cart is empty.</h1>
            <p>Your premium selections will show up here once added. Explore our catalog to find exclusive picks.</p>
          </div>
          <Link className="customer-primary-button" to="/customer">
            Browse Products
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Cart</p>
          <h1>Your selected products.</h1>
          <p>Review premium picks, apply offers, and continue to a secure V SHOP checkout.</p>
        </div>
        <Link className="customer-primary-button cart-checkout-link" to="/customer/checkout">
          Checkout
        </Link>
      </section>

      <section className="customer-content-grid">
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">Cart items</p>
              <h2>Ready to buy</h2>
            </div>
            <span className="customer-pill">{cartItems.length} items</span>
          </div>

          <div className="wishlist-list">
            {cartItems.map((item) => {
              const product = getProduct(item);
              const id = getItemId(item);

              return (
                <div className="wishlist-card" key={id || product.name}>
                  <img src={getProductImage(product)} alt={product.name || "Product"} />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{getSellerName(product)}</p>
                    <div className="cart-line-meta">
                      <strong>{formatPrice(Number(product.price || 0) * (Number(item.quantity) || 1))}</strong>
                      <span>Qty: {item.quantity || 1}</span>
                      {getLineDiscount(item) > 0 ? <span>{formatPrice(getLineDiscount(item))} off</span> : null}
                    </div>
                  </div>
                  <button
                    className="customer-secondary-button"
                    type="button"
                    onClick={() => handleRemove(id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </article>

        <article className="customer-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">Summary</p>
              <h2>Order total</h2>
            </div>
          </div>
          <div className="offer-stack">
            <div>
              <strong>Subtotal</strong>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div>
              <strong>Product discount</strong>
              <span>{formatPrice(totals.discount)} saved</span>
            </div>
            <div>
              <strong>Delivery charge</strong>
              <span>{totals.deliveryCharge ? formatPrice(totals.deliveryCharge) : "Free"}</span>
            </div>
            <div>
              <strong>Total</strong>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default CartPage;
