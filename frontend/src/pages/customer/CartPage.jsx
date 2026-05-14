import { products } from "./customerData";

function CartPage() {
  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Cart</p>
          <h1>Your selected products.</h1>
          <p>Review premium picks, apply offers, and continue to a secure V SHOP checkout.</p>
        </div>
        <button className="customer-primary-button" type="button">Checkout</button>
      </section>

      <section className="customer-content-grid">
        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Cart items</p><h2>Ready to buy</h2></div><span className="customer-pill">3 items</span></div>
          <div className="wishlist-list">
            {products.slice(0, 3).map((item) => (
              <div className="wishlist-card" key={item.name}>
                <img src={item.image} alt={item.name} />
                <div><h3>{item.name}</h3><p>{item.vendor}</p><strong>{item.price}</strong></div>
                <button className="customer-secondary-button" type="button">Remove</button>
              </div>
            ))}
          </div>
        </article>

        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Summary</p><h2>Order total</h2></div></div>
          <div className="offer-stack">
            <div><strong>Subtotal</strong><span>₹27,997</span></div>
            <div><strong>Discount</strong><span>₹3,200 saved</span></div>
            <div><strong>Total</strong><span>₹24,797</span></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default CartPage;
