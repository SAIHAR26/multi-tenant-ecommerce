import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { categoryTabs, priceRanges, products } from "./customerData";

const brands = [...new Set(products.map((product) => product.brand))].sort();
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

  useEffect(() => {
    if (searchTerm) {
      productBrowsingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchTerm]);

  const clearSearch = () => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete("search");
    setSearchParams(nextSearchParams, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const selectedPriceRange = priceRanges.find((range) => range.label === priceFilter);
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesCategory = normalizedSearch
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

  return (
    <div className="customer-page marketplace-home">
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

      <section className="offer-banner-grid" aria-label="Special shopping offers">
        {["Festival Sale", "Limited Offer", "Premium Collection", "Flash Sale"].map((offer, index) => (
          <article className="offer-banner" key={offer}>
            <span>0{index + 1}</span>
            <h2>{offer}</h2>
            <p>{index % 2 === 0 ? "Red hot vendor deals" : "Members-only luxury prices"}</p>
          </article>
        ))}
      </section>

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
          <div className="browse-toolbar">
            <div className="browse-context">
              <div>
                <span>{searchTerm ? "Search results" : "Showing now"}</span>
                <strong>{searchTerm ? searchTerm : activeCategory}</strong>
              </div>
              <p>{filteredProducts.length} products</p>
              {searchTerm ? (
                <button className="filter-reset" type="button" onClick={clearSearch}>
                  Clear
                </button>
              ) : null}
            </div>

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
              <ProductCard product={product} key={product.id} />
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
    </div>
  );
}

export default CustomerDashboard;
