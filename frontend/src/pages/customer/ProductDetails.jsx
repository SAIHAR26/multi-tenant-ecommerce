import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { useToast } from "../../components/useToast";
import { addToCart } from "../../services/cartService";
import {
  getProductById,
  getProducts,
} from "../../services/productService";
import { getReviews } from "../../services/reviewService";
import { addToWishlist } from "../../services/wishlistService";
import { getProductImage } from "../../utils/productImages";
import "./ProductDetails.css";

const sizes = ["S", "M", "L", "XL"];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const [productData, allProducts, productReviews] = await Promise.all([
          getProductById(id),
          getProducts(),
          getReviews(id).catch(() => []),
        ]);

        const currentProduct =
          productData.product || productData;

        const productsArray = Array.isArray(allProducts.products)
          ? allProducts.products
          : Array.isArray(allProducts)
          ? allProducts
          : [];

        setProduct(currentProduct);
        setProducts(productsArray);
        setReviews(Array.isArray(productReviews) ? productReviews : []);

        setSelectedImage(
          getProductImage(currentProduct)
        );
      } catch (err) {
        console.log(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const similarProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((item) => item._id !== product._id)
      .filter((item) => item.category === product.category || item.brand === product.brand)
      .slice(0, 4);
  }, [product, products]);

  const galleryImages = useMemo(() => {
    if (!product) return [];

    const images = Array.isArray(product.images) && product.images.length
      ? product.images
      : [getProductImage(product)];

    return [...new Set(images.filter(Boolean))];
  }, [product]);

  if (loading) {
    return (
      <div className="product-details-state">
        <h1>Loading product...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-state">
        <h1>{error}</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-state">
        <h1>Product not found</h1>

        <button
          type="button"
          onClick={() => navigate("/customer")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-IN").format(product.price || 0);
  const stockCount = product.stock || 10;
  const productSizes = product.sizes?.length ? product.sizes : sizes;
  const vendorName = product.storeId?.storeName || product.brand || "V SHOP";
  const vendorDescription =
    product.storeId?.storeDescription ||
    `${vendorName} is a verified V SHOP seller.`;

  const availability =
    stockCount > 10
      ? "In Stock"
      : "Only Few Left";

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product, quantity);
      showToast("Product added to cart");
    } catch (err) {
      showToast(err.message || "Unable to add product to cart", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
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

  return (
    <div className="product-details-page">
      <section className="product-details-shell">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img
              src={selectedImage}
              alt={product.name}
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="product-gallery__thumbs">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={
                    image === selectedImage
                      ? "product-gallery__thumb is-active"
                      : "product-gallery__thumb"
                  }
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <article className="product-info-panel">
          <div className="product-info-panel__header">
            <p className="customer-eyebrow">
              {product.category || "Fashion"}
            </p>

            <h1>{product.name}</h1>

            <span>
              by {product.brand || "V SHOP"}
            </span>
          </div>

          <div className="product-price-block">
            <strong>₹{formattedPrice}</strong>
          </div>

          <div className="product-status-grid">
            <div>
              <span>Availability</span>
              <strong>{availability}</strong>
              <small>{stockCount} pieces ready</small>
            </div>

            <div>
              <span>Vendor</span>
              <strong>
                {vendorName}
              </strong>
              <small>Verified seller</small>
            </div>
          </div>

          <div className="product-description">
            <h2>Product Description</h2>
            <p>
              {product.description ||
                `${product.name} available in V SHOP marketplace.`}
            </p>
          </div>

          <div className="product-vendor-panel">
            <h2>Vendor Details</h2>
            <div>
              <strong>{vendorName}</strong>
              <span>{product.storeId?.storeCategory || product.category || "Marketplace"}</span>
            </div>
            <p>{vendorDescription}</p>
            <small>{product.storeId?.location || "India"} · Verified seller</small>
          </div>

          <div className="product-size-section">
            <h2>Select Size</h2>
            <div className="product-size-options">
              {productSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={
                    selectedSize === size ? "is-selected" : ""
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-quantity-section">
            <h2>Quantity</h2>

            <div className="product-quantity-control">
              <button
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(stockCount, prev + 1)
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="product-action-row">
            <button
              type="button"
              className="product-action product-action--primary"
              disabled={isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              type="button"
              className="product-action product-action--solid"
              onClick={async () => {
                await handleAddToCart();
                navigate("/customer/cart");
              }}
            >
              Buy Now
            </button>

            <button
              type="button"
              className="product-action product-action--outline"
              disabled={isAddingToWishlist}
              onClick={handleAddToWishlist}
            >
              {isAddingToWishlist ? "Saving..." : "Add to Wishlist"}
            </button>
          </div>
        </article>
      </section>

      <section className="similar-products-section">
        <div className="customer-panel__header">
          <div>
            <p className="customer-eyebrow">Customer proof</p>
            <h2>Reviews</h2>
          </div>

          <span>{reviews.length} reviews</span>
        </div>

        {reviews.length > 0 ? (
          <div className="product-review-list">
            {reviews.map((review) => (
              <article key={review._id}>
                <div>
                  <strong>{review.userId?.name || "V SHOP customer"}</strong>
                  <span>{review.rating} stars</span>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="product-details-state product-details-state--inline">
            <h2>No reviews yet</h2>
            <p>Reviews from customers in the database will appear here.</p>
          </div>
        )}
      </section>

      <section className="similar-products-section">
        <div className="customer-panel__header">
          <div>
            <p className="customer-eyebrow">Recommended</p>
            <h2>Similar Products</h2>
          </div>

          <span>{similarProducts.length} picks</span>
        </div>

        {similarProducts.length > 0 ? (
          <div className="marketplace-product-grid marketplace-product-grid--lane">
            {similarProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                allProducts={products}
              />
            ))}
          </div>
        ) : (
          <div className="product-details-state">
            <h2>No similar products found</h2>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductDetails;
