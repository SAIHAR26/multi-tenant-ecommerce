import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCartItems, removeFromCart } from "../../services/cartService";

function CartPage() {
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
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load your shopping cart. " + (err.message || ""));
          setLoading(false);
        }
      }
    }

    fetchCart();
    return () => { isMounted = false; };
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      setCartItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Could not remove item. Try again. " + (err.message || ""));
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const discount = subtotal > 0 ? 3200 : 0; 
  const total = subtotal - discount;

  if (loading) {
    return (
      <div className="customer-page"><p className="customer-eyebrow">Loading your cart...</p></div>
    );
  }

  if (error) {
    return (
      <div className="customer-page"><p className="customer-eyebrow" style={{ color: "red" }}>{error}</p></div>
    );
  }

  /* STEP 7: EMPTY STATE */
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="customer-page">
        <section className="customer-hero customer-hero--compact">
          <div>
            <p className="customer-eyebrow">Cart Status</p>
            <h1>Your cart is empty.</h1>
            <p>Your premium selections will show up here once added. Explore our catalog to find exclusive picks.</p>
          </div>
          <Link className="customer-primary-button" to="/customer/dashboard">Browse Products</Link>
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
            {cartItems.map((item) => (
              <div className="wishlist-card" key={item._id || item.name}>
                <img src={item.image} alt={item.name} />
                <div><h3>{item.name}</h3><p>{item.vendor}</p><strong>₹{item.price}</strong></div>
                <button 
                  className="customer-secondary-button" 
                  type="button"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Summary</p><h2>Order total</h2></div></div>
          <div className="offer-stack">
            <div><strong>Subtotal</strong><span>₹{subtotal.toLocaleString()}</span></div>
            <div><strong>Discount</strong><span>₹{discount.toLocaleString()} saved</span></div>
            <div><strong>Total</strong><span>₹{total > 0 ? total.toLocaleString() : 0}</span></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default CartPage;