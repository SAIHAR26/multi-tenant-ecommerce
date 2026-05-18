import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { categoryTabs, priceRanges, products } from "./customerData";

const brands = [
  "Nike",
  "Puma",
  "Adidas",
  "Apple",
  "Sony",
  "Samsung",
  "Zara",
  "Ray-Ban",
  "H&M",
  "Mango",
  "Levi's",
  "Canon",
  "JBL",
  "Asus",
  "Penguin",
  "Harper",
  "Tommy Hilfiger",
  "Swarovski",
  "Dior",
  "Google",
];
const ratingFilters = [4, 3];
const discountFilters = [10, 25, 50];

function CustomerDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productBrowsingRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("Trending");
  const searchTerm = searchParams.get("search") || "";
  const [priceFilter, setPriceFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [discountFilter, setDiscountFilter] = useState(0);
  const [brandFilter, setBrandFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      productBrowsingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    const nextSearchTerm = event.target.value;

    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextSearchTerm.trim()) {
      nextSearchParams.set("search", nextSearchTerm);
    } else {
      nextSearchParams.delete("search");
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const selectedPriceRange = priceRanges.find((range) => range.label === priceFilter);
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesCategory =
          normalizedSearch
            ? true
            : activeCategory === "Trending"
            ? product.isTrending
            : activeCategory === "New Arrivals"
              ? product.isNew
              : product.category === activeCategory;
        const matchesSearch = [product.name, product.brand, product.vendor, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
        const matchesPrice = selectedPriceRange
          ? product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
          : true;
        const matchesRating = ratingFilter ? product.rating >= ratingFilter : true;
        const matchesDiscount = discountFilter ? product.discountPercent >= discountFilter : true;
        const matchesBrand = brandFilter === "All" ? true : product.brand === brandFilter;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesDiscount && matchesBrand;
      })
      .sort((first, second) => {
        if (sortBy === "Price Low to High") return first.price - second.price;
        if (sortBy === "Price High to Low") return second.price - first.price;
        if (sortBy === "Best Rated") return second.rating - first.rating;
        if (sortBy === "Newest") return Number(second.isNew) - Number(first.isNew);
        if (sortBy === "Trending") return Number(second.isTrending) - Number(first.isTrending);
        return second.popularity - first.popularity;
      });
  }, [activeCategory, brandFilter, discountFilter, priceFilter, ratingFilter, searchTerm, sortBy]);

  const featuredProducts = products.filter((product) => product.isTrending).slice(0, 4);
  const recentlyViewed = products.slice(8, 12);
  const recommended = products.filter((product) => product.rating >= 4.6).slice(0, 4);

  return (
    <div className="customer-page marketplace-home">
      {/* Hero section for the premium ecommerce campaign. */}
      <section className="marketplace-hero">
        <div className="marketplace-hero__content">
          <p className="customer-eyebrow">Festival Sale live now</p>
          <h1>Luxury marketplace drops, curated for every cart.</h1>
          <p>
            Explore premium fashion, electronics, books, shoes, accessories, and daily deals from verified V SHOP
            vendors.
          </p>
          <div className="marketplace-hero__actions">
            <button className="customer-primary-button" type="button">Shop Now</button>
            <span>Up to 50% off on flash picks</span>
          </div>
        </div>

        <div className="marketplace-hero__deal">
          <span>Featured Offer</span>
          <strong>Premium Collection</strong>
          <p>Extra 15% off on luxe accessories and red-tag sneakers tonight.</p>
        </div>
      </section>

      {/* Cinematic offer banners keep the page feeling like a real marketplace. */}
      <section className="offer-banner-grid" aria-label="Special shopping offers">
        {["Festival Sale", "Limited Offer", "Premium Collection", "Flash Sale"].map((offer, index) => (
          <article className="offer-banner" key={offer}>
            <span>0{index + 1}</span>
            <h2>{offer}</h2>
            <p>{index % 2 === 0 ? "Red hot vendor deals" : "Members-only luxury prices"}</p>
          </article>
        ))}
      </section>

      {/* Category tabs change the product feed immediately. */}
      <section className="category-strip" aria-label="Shop by category">
        {categoryTabs.map((category) => (
          <button
            className={`category-pill ${activeCategory === category ? "category-pill--active" : ""}`}
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="marketplace-layout">
        <aside className="filter-panel" aria-label="Product filters">
          <div className="filter-panel__header">
            <p className="customer-eyebrow">Filters</p>
            <button
              className="filter-reset"
              type="button"
              onClick={() => {
                setPriceFilter("All");
                setRatingFilter(0);
                setDiscountFilter(0);
                setBrandFilter("All");
              }}
            >
              Reset
            </button>
          </div>

          <div className="filter-group">
            <h3>Price Range</h3>
            {["All", ...priceRanges.map((range) => range.label)].map((range) => (
              <button
                className={priceFilter === range ? "filter-choice filter-choice--active" : "filter-choice"}
                key={range}
                type="button"
                onClick={() => setPriceFilter(range)}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3>Rating</h3>
            {ratingFilters.map((rating) => (
              <button
                className={ratingFilter === rating ? "filter-choice filter-choice--active" : "filter-choice"}
                key={rating}
                type="button"
                onClick={() => setRatingFilter(rating)}
              >
                {rating} star and above
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3>Discount</h3>
            {discountFilters.map((discount) => (
              <button
                className={discountFilter === discount ? "filter-choice filter-choice--active" : "filter-choice"}
                key={discount}
                type="button"
                onClick={() => setDiscountFilter(discount)}
              >
                {discount}% Off
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3>Brand</h3>
            <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
              <option>All</option>
              {brands.map((brand) => (
                <option key={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </aside>

        <div className="product-browsing" ref={productBrowsingRef}>
          {/* Search and sorting control the grid in real time. */}
          <div className="browse-toolbar">
            <label className="marketplace-search" htmlFor="marketplace-search">
              <span>Search</span>
              <input
                id="marketplace-search"
                type="search"
                placeholder="Search products, brands, vendors..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </label>

            <label className="sort-control" htmlFor="sort-products">
              <span>Sort</span>
              <select id="sort-products" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option>Most Popular</option>
                <option>Trending</option>
                <option>Best Rated</option>
                <option>Newest</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
              </select>
            </label>
          </div>

          <div className="browse-summary">
            <div>
              <p className="customer-eyebrow">{activeCategory}</p>
              <h2>{filteredProducts.length} premium products found</h2>
            </div>
            <span>Live filters active</span>
          </div>

          <div className="marketplace-product-grid">
            {filteredProducts.map((product) => (
              <ProductCard product={product} key={product.id} onQuickView={setSelectedProduct} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-browse-state">
              <h2>No products matched these filters.</h2>
              <p>Try a wider price range, another brand, or a different category.</p>
            </div>
          )}
        </div>
      </section>

      <ProductLane title="Trending Products" products={featuredProducts} onQuickView={setSelectedProduct} />
      <ProductLane title="Most Popular" products={products.slice(0, 4)} onQuickView={setSelectedProduct} />
      <ProductLane title="Recently Viewed" products={recentlyViewed} onQuickView={setSelectedProduct} />
      <ProductLane title="Recommended For You" products={recommended} onQuickView={setSelectedProduct} />

      {selectedProduct ? (
        <ProductQuickView
          product={selectedProduct}
          products={products}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={setSelectedProduct}
        />
      ) : null}
    </div>
  );
}

function ProductLane({ title, products, onQuickView }) {
  return (
    <section className="product-lane">
      <div className="customer-panel__header">
        <div>
          <p className="customer-eyebrow">V SHOP picks</p>
          <h2>{title}</h2>
        </div>
        <button className="customer-secondary-button" type="button">View all</button>
      </div>
      <div className="marketplace-product-grid marketplace-product-grid--lane">
        {products.map((product) => (
          <ProductCard product={product} key={`${title}-${product.id}`} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
}

function ProductQuickView({ product, products, onClose, onSelectProduct }) {
  const [quantity, setQuantity] = useState(1);
  const productDetails = getProductDetails(product);
  const reviews = getProductReviews(product);
  const suggestedProducts = getSuggestedProducts(product, products);
  const formattedPrice = new Intl.NumberFormat("en-IN").format(product.price);
  const stockStatus = productDetails.stock > 10 ? "In stock" : productDetails.stock > 0 ? "Low stock" : "Sold out";

  return (
    <div className="quick-view-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="quick-view"
        aria-label={`${product.name} quick view`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="quick-view__close" type="button" aria-label="Close quick view" onClick={onClose}>
          X
        </button>

        <div className="quick-view__media">
          <img src={product.image} alt={product.name} />
          <div className="quick-view__thumbs" aria-label="Product images">
            {productDetails.images.map((image, index) => (
              <img src={image} alt={`${product.name} view ${index + 1}`} key={`${product.id}-image-${index}`} />
            ))}
          </div>
        </div>

        <div className="quick-view__content">
          <div className="quick-view__header">
            <p className="customer-eyebrow">{product.category}</p>
            <h2>{product.name}</h2>
            <p>{productDetails.description}</p>
          </div>

          <div className="quick-view__price-row">
            <strong>Rs {formattedPrice}</strong>
            <span>{product.discountPercent}% off</span>
            <span>{product.rating} star rating</span>
          </div>

          <div className="quick-view__vendor">
            <div>
              <span>Vendor</span>
              <strong>{product.vendor}</strong>
            </div>
            <p>{productDetails.vendorDetails}</p>
          </div>

          <div className="quick-view__buy-box">
            <div>
              <span>Availability</span>
              <strong className={productDetails.stock > 0 ? "stock-ok" : "stock-empty"}>{stockStatus}</strong>
              <small>{productDetails.stock} units available</small>
            </div>

            <label className="quantity-control">
              <span>Quantity</span>
              <div>
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                  -
                </button>
                <input type="number" min="1" max={productDetails.stock} value={quantity} readOnly />
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(productDetails.stock, value + 1))}
                >
                  +
                </button>
              </div>
            </label>
          </div>

          <div className="quick-view__actions">
            <button className="customer-primary-button" type="button" disabled={productDetails.stock === 0}>
              Add {quantity} to Cart
            </button>
            <button className="customer-secondary-button" type="button">Save to Wishlist</button>
          </div>

          <div className="quick-view__reviews">
            <div className="quick-view__section-title">
              <h3>Ratings and Reviews</h3>
              <span>{reviews.length} product reviews</span>
            </div>
            {reviews.map((review) => (
              <article className="quick-view__review" key={`${product.id}-${review.author}`}>
                <div>
                  <strong>{review.author}</strong>
                  <span>{review.rating} star</span>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>

          <div className="quick-view__suggested">
            <div className="quick-view__section-title">
              <h3>Suggested Products</h3>
              <span>Similar {product.category.toLowerCase()} picks</span>
            </div>
            <div className="quick-view__suggested-grid">
              {suggestedProducts.map((suggestion) => (
                <button
                  className="quick-view__suggestion"
                  type="button"
                  key={suggestion.id}
                  onClick={() => {
                    setQuantity(1);
                    onSelectProduct(suggestion);
                  }}
                >
                  <img src={suggestion.image} alt={suggestion.name} />
                  <span>{suggestion.brand}</span>
                  <strong>{suggestion.name}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getProductDetails(product) {
  const stock = ((product.id * 7) % 34) + 3;
  const images = [product.image, ...productsByCategory(product.category).slice(0, 2).map((item) => item.image)];

  return {
    stock,
    images,
    description: `${product.name} from ${product.brand} is a premium ${product.category.toLowerCase()} pick by ${product.vendor}, selected for everyday comfort, polished styling, and reliable quality.`,
    vendorDetails: `${product.vendor} is a verified V SHOP seller with fast dispatch, protected payments, and category-specialist support.`,
  };
}

function getProductReviews(product) {
  const reviewTemplates = [
    `The ${product.category.toLowerCase()} quality feels premium and the finish matches the product photos.`,
    `Bought this from ${product.vendor}; packaging was neat and delivery updates were clear.`,
    `Good value for the price. I liked the ${product.brand} styling and would consider similar products.`,
  ];

  return reviewTemplates.map((comment, index) => ({
    author: ["Anaya R.", "Karthik M.", "Meera S."][index],
    rating: Math.max(4, Number((product.rating - index * 0.2).toFixed(1))),
    comment,
  }));
}

function getSuggestedProducts(product, allProducts) {
  return allProducts
    .filter((item) => item.id !== product.id)
    .map((item) => ({
      ...item,
      relevance:
        (item.category === product.category ? 4 : 0) +
        (item.vendor === product.vendor ? 3 : 0) +
        (item.brand === product.brand ? 2 : 0) +
        item.rating / 10,
    }))
    .sort((first, second) => second.relevance - first.relevance || second.rating - first.rating)
    .slice(0, 4);
}

function productsByCategory(category) {
  return products.filter((product) => product.category === category);
}

export default CustomerDashboard;
