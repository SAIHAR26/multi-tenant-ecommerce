import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product = {}, allProducts = [] }) {
  const navigate = useNavigate();
  const [previewProduct, setPreviewProduct] = useState(null);

  const productId = product?._id;

  const formattedPrice = new Intl.NumberFormat("en-IN").format(
    product?.price || 0
  );

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewProduct((prev) => (prev ? null : product));
  };

  const goToDetails = () => {
    if (!productId) return;
    navigate(`/customer/product/${productId}`);
  };

  return (
    <article className="customer-product-card">
      {/* IMAGE */}
      <div className="customer-product-card__image">
        <button type="button" onClick={goToDetails}>
          <img
            src={product?.image || "https://via.placeholder.com/300"}
            alt={product?.name}
          />
          <span>{product?.discount || 0}% off</span>
        </button>

        <button className="wishlist-action" type="button">
          ❤️
        </button>
      </div>

      {/* BODY */}
      <div className="customer-product-card__body">
        <div>
          <button
            className="customer-product-card__title"
            type="button"
            onClick={goToDetails}
          >
            {product?.name}
          </button>
          <p>{product?.brand || "V SHOP"}</p>
        </div>

        <div className="customer-product-card__meta">
          <strong>₹ {formattedPrice}</strong>
          <span>{product?.rating || 4} ★</span>
        </div>

        <div className="customer-product-card__actions">
          <button
            className="customer-secondary-button"
            type="button"
            onClick={handleQuickView}
          >
            Quick View
          </button>

          <button
            className="customer-primary-button"
            type="button"
            onClick={() => navigate("/customer/cart")}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* QUICK VIEW */}
      {previewProduct && (
        <QuickView
          product={previewProduct}
          allProducts={allProducts}
          onClose={() => setPreviewProduct(null)}
          navigate={navigate}
        />
      )}
    </article>
  );
}

function QuickView({ product = {}, allProducts = [], onClose, navigate }) {
  const [quantity, setQuantity] = useState(1);

  const productId = product?._id;

  const formattedPrice = new Intl.NumberFormat("en-IN").format(
    product?.price || 0
  );

  const suggestedProducts =
    allProducts
      ?.filter((item) => item?._id !== productId)
      ?.slice(0, 3) || [];

  return (
    <section className="quick-view-popover">
      <button onClick={onClose}>X</button>

      <img
        src={product?.image || "https://via.placeholder.com/300"}
        alt={product?.name}
      />

      <h2>{product?.name}</h2>
      <p>{product?.description || "No description available"}</p>

      <strong>₹ {formattedPrice}</strong>
      <p>{product?.rating || 4} ★ rating</p>

      {/* QUANTITY */}
      <div>
        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity((q) => q + 1)}>+</button>
      </div>

      <button>Add to Cart</button>

      <button
        onClick={() => {
          if (!productId) return;
          navigate(`/customer/product/${productId}`);
        }}
      >
        View Details
      </button>

      {/* SUGGESTED */}
      <h3>Suggested Products</h3>

      <div>
        {suggestedProducts.length > 0 ? (
          suggestedProducts.map((item) => (
            <button
              key={item?._id}
              onClick={() =>
                item?._id &&
                navigate(`/customer/product/${item._id}`)
              }
            >
              <img
                src={item?.image || "https://via.placeholder.com/100"}
                alt={item?.name}
              />
              <p>{item?.name}</p>
            </button>
          ))
        ) : (
          <p>No suggestions</p>
        )}
      </div>
    </section>
  );
}

export default ProductCard;