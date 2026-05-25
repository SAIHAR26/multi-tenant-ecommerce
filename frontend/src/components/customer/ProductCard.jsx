import { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultProduct from "../../assets/default-product.png";
import { useToast } from "../useToast";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";
import { getProductImage, PRODUCT_IMAGE_FALLBACK } from "../../utils/productImages";

function ProductCard({ product = {}, allProducts = [] }) {
  const navigate = useNavigate();

  const [previewProduct, setPreviewProduct] = useState(null);

  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);

  const formattedPrice = new Intl.NumberFormat("en-IN").format(
    product?.price || 0
  );

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewProduct(product);
  };

  const goToDetails = () => {
    if (!productId) return;

    navigate(`/customer/product/${productId}`);
  };

  return (
    <>
      <article className="customer-product-card">
        <div className="customer-product-card__image">
          <img
            src={product?.image || defaultProduct}
            src={productImage}
            alt={product?.name || "Product"}
          />

          <span>{product?.discount || 0}% OFF</span>
        </div>

        <div className="customer-product-card__body">
          <h3>{product?.name || "Product Name"}</h3>

          <p>{product?.brand || "V SHOP"}</p>

          <div className="customer-product-card__meta">
            <strong>₹ {formattedPrice}</strong>

            <span>⭐ {product?.rating || 4}</span>
          </div>

          <div className="customer-product-card__actions">
            <button onClick={handleQuickView}>
              Quick View
            </button>

            <button onClick={goToDetails}>
              View Details
            </button>
          </div>
        </div>
      </article>

      {previewProduct && (
        <QuickView
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}
    </>
  );
}

function QuickView({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);

  const formattedPrice = new Intl.NumberFormat("en-IN").format(
    product?.price || 0
  );

  return (
    <div className="quick-view-popover">
      <button onClick={onClose}>X</button>

      <img
        src={product?.image || defaultProduct}
        src={productImage}
        alt={product?.name || "Product"}
        width="250"
      />

      <h2>{product?.name}</h2>

      <p>
        {product?.description || "No description available"}
      </p>

      <h3>₹ {formattedPrice}</h3>

      <p>⭐ {product?.rating || 4}</p>

      <div>
        <button
          onClick={() =>
            setQuantity((prev) => Math.max(1, prev - 1))
          }
        >
          -
        </button>

        <span style={{ margin: "0 10px" }}>
          {quantity}
        </span>

        <button
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          +
        </button>
      <h3>Suggested Products</h3>

      <div>
        {suggestedProducts.length > 0 ? (
          suggestedProducts.map((item) => (
            <button
              key={item?._id || item?.id}
              type="button"
              onClick={() => {
                const id = item?._id || item?.id;
                if (id) navigate(`/customer/product/${id}`);
              }}
            >
              <img
                src={getProductImage(item, PRODUCT_IMAGE_FALLBACK)}
                alt={item?.name || "Product"}
              />
              <p>{item?.name}</p>
            </button>
          ))
        ) : (
          <p>No suggestions</p>
        )}
      </div>

      <button>Add To Cart</button>
    </div>
  );
}

export default ProductCard;