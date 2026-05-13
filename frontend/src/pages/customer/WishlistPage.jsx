import WishlistCard from "../../components/customer/WishlistCard";
import { products } from "./customerData";

function WishlistPage() {
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
          <span className="customer-pill">42 saved</span>
        </div>
        <div className="wishlist-grid">
          {products.map((item) => (
            <WishlistCard item={item} key={item.name} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default WishlistPage;
