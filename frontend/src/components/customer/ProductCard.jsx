import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../useToast";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";
import { getProductImage, PRODUCT_IMAGE_FALLBACK } from "../../utils/productImages";

function ProductCard({ product = {}, allProducts = [] }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [previewProduct, setPreviewProduct] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);

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

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsAddingToWishlist(true);
      await addToWishlist(product);
      showToast("Product added to wishlist");
    } catch (err) {
      showToast(err.message || "Unable to add product to wishlist", "error");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product);
      showToast("Product added to cart");
      navigate("/customer/cart");
    } catch (err) {
      showToast(err.message || "Unable to add product to cart", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <article className="customer-product-card">
      <div className="customer-product-card__image">
        <button type="button" onClick={goToDetails}>
          <img
            src={productImage}
            alt={product?.name || "Product"}
          />
          <span>{product?.discount || 0}% off</span>
        </button>

        <button
          className="wishlist-action"
          type="button"
          aria-label="Add to wishlist"
          disabled={isAddingToWishlist}
          onClick={handleAddToWishlist}
        >
          Heart
        </button>
      </div>

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
          <strong>Rs {formattedPrice}</strong>
          <span>{product?.rating || 4} stars</span>
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
            disabled={isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

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
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);

  const formattedPrice = new Intl.NumberFormat("en-IN").format(
    product?.price || 0
  );

  const suggestedProducts =
    allProducts
      ?.filter((item) => (item?._id || item?.id) !== productId)
      ?.slice(0, 3) || [];

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product, quantity);
      showToast("Product added to cart");
      navigate("/customer/cart");
    } catch (err) {
      showToast(err.message || "Unable to add product to cart", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <section className="quick-view-popover">
      <button type="button" onClick={onClose}>X</button>

      <img
        src={productImage}
        alt={product?.name || "Product"}
      />

      <h2>{product?.name}</h2>
      <p>{product?.description || "No description available"}</p>

      <strong>Rs {formattedPrice}</strong>
      <p>{product?.rating || 4} stars rating</p>

      <div>
        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
          -
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
      </div>

      <button type="button" disabled={isAddingToCart} onClick={handleAddToCart}>
        {isAddingToCart ? "Adding..." : "Add to Cart"}
      </button>

      <button
        type="button"
        onClick={() => {
          if (!productId) return;
          navigate(`/customer/product/${productId}`);
        }}
      >
        View Details
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
    </section>
  );
}

export default ProductCard;
