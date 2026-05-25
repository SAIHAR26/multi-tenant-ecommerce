import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { useToast } from "../../components/useToast";
import { getCartItems, removeFromCart } from "../../services/cartService";
import { getProductImage } from "../../utils/productImages";
import { calculateOrderTotals, formatPrice, getLineDiscount } from "../../utils/orderTotals";

import {
  getCartItems,
  removeFromCart,
} from "../../services/cartService";

const getItemId = (item) =>
  item?._id ||
  item?.id ||
  item?.productId ||
  item?.product?._id ||
  item?.product?.id;

const getProduct = (item) =>
  item?.product || item;

function CartPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cartItems, setCartItems] =
    useState([]);
const getItemId = (item) => item._id || item.id || item.productId || item.product?._id;
const getProduct = (item) => item.product || item;

function CartPage() {
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

  // REMOVE ITEM
  const handleRemove = async (
    id
  ) => {
    if (!id) {
      showToast({ message: "Invalid item identifier", type: "error" });
      return;
    }
    try {
      await removeFromCart(id);

      setCartItems((prev) =>
        prev.filter(
          (item) =>
            getItemId(item) !== id
        )
      );

      showToast({ message: "Item removed from cart", type: "success" });
    } catch (err) {
      showToast({
        message: err.message || "Could not remove item",
        type: "error"
      });
  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      setCartItems((prev) => prev.filter((item) => getItemId(item) !== id));
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
    return (
      <div className="customer-page">
        <ErrorState title="Unable to load cart" message={error} />
      </div>
    );
  }

  // EMPTY CART STATE
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="customer-page">
        <section className="customer-hero customer-hero--compact">
          <div style={{ textAlign: "center", padding: "40px 20px", width: "100%" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
            <h1 style={{ marginBottom: "8px" }}>Your V SHOP cart is empty</h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Looks like you haven't added any luxury drops to your cart yet.
            </p>
            <button
              onClick={() => navigate("/customer")}
              className="customer-primary-button"
              type="button"
            >
              Explore Trending Products
            </button>
          </div>
          <div>
            <p className="customer-eyebrow">Cart Status</p>
            <h1>Your cart is empty.</h1>
            <p>Your premium selections will show up here once added. Explore our catalog to find exclusive picks.</p>
          </div>
          <Link className="customer-primary-button" to="/customer">Browse Products</Link>
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
        <Link className="customer-primary-button cart-checkout-link" to="/customer/checkout">Checkout</Link>
      </section>

      <section className="customer-content-grid">
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div><p className="customer-eyebrow">Cart items</p><h2>Ready to buy</h2></div>
            <span className="customer-pill">{cartItems.length} items</span>
          </div>
          <div className="wishlist-list">
            {cartItems.map((item) => {
              const product = getProduct(item);
              const id = getItemId(item);

              return (
                <div
                  className="wishlist-card"
                  key={
                    id ||
                    product?.name ||
                    Math.random()
                  }
                >
                  {/* PRODUCT IMAGE */}
                  {product?.image ? (
                    <img
                      src={product.image}
                      alt={
                        product?.name ||
                        "Product"
                      }
                    />
                  ) : (
                    <div className="product-no-image">
                      No Image
                    </div>
                  )}

                  {/* PRODUCT INFO */}
                <div className="wishlist-card" key={id || product.name}>
                  <img src={getProductImage(product)} alt={product.name} />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.vendor || product.brand}</p>
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
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Summary</p><h2>Order total</h2></div></div>
          <div className="offer-stack">
            <div><strong>Subtotal</strong><span>{formatPrice(totals.subtotal)}</span></div>
            <div><strong>Product discount</strong><span>{formatPrice(totals.discount)} saved</span></div>
            <div><strong>Delivery charge</strong><span>{totals.deliveryCharge ? formatPrice(totals.deliveryCharge) : "Free"}</span></div>
            <div><strong>Total</strong><span>{formatPrice(totals.total)}</span></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default CartPage;
