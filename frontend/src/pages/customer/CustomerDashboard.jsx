import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { categoryTabs, priceRanges, products } from "./customerData";

function CustomerDashboard() {
const [searchParams, setSearchParams] = useSearchParams();

const productBrowsingRef = useRef(null);

const [activeCategory, setActiveCategory] =
  useState("Trending");

const searchTerm =
  searchParams.get("search") || "";

const [priceFilter, setPriceFilter] =
  useState("All");

const [ratingFilter, setRatingFilter] =
  useState(0);

const [discountFilter, setDiscountFilter] =
  useState(0);

const [brandFilter, setBrandFilter] =
  useState("All");

const [sortBy, setSortBy] =
  useState("Most Popular");

const [selectedProduct, setSelectedProduct] =
  useState(null);

useEffect(() => {
  if (searchTerm) {
    productBrowsingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [searchTerm]);

const clearSearch = () => {
  const nextSearchParams =
    new URLSearchParams(searchParams);

  nextSearchParams.delete("search");

  setSearchParams(
    nextSearchParams,
    { replace: true }
  );
};
  const filteredProducts = useMemo(() => {
    const selectedPriceRange =
      priceRanges.find(
        (range) => range.label === priceFilter
      );

    return products
      .filter((product) => {
        const matchesCategory =
          activeCategory === "Trending"
            ? product.isTrending
            : product.category ===
              activeCategory;

        const matchesSearch = [
          product.name,
          product.brand,
          product.vendor,
        ]
          .join(" ")
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

        const matchesPrice =
          selectedPriceRange
            ? product.price >=
                selectedPriceRange.min &&
              product.price <=
                selectedPriceRange.max
            : true;

        return (
          matchesCategory &&
          matchesSearch &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        if (
          sortBy ===
          "Price Low to High"
        ) {
          return a.price - b.price;
        }

        if (
          sortBy ===
          "Price High to Low"
        ) {
          return b.price - a.price;
        }

        return (
          b.popularity - a.popularity
        );
      });
  }, [
    activeCategory,
    searchTerm,
    priceFilter,
    sortBy,
  ]);

  return (
    <div className="customer-page">
      <section className="marketplace-hero">
        <h1>V SHOP Marketplace</h1>

        <p>
          Explore premium products
          from verified vendors.
        </p>
      </section>

      <section className="category-strip">
        {categoryTabs.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              setActiveCategory(category)
            }
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
          key={range}
          type="button"
          className={
            priceFilter === range
              ? "filter-choice filter-choice--active"
              : "filter-choice"
          }
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
          key={rating}
          type="button"
          className={
            ratingFilter === rating
              ? "filter-choice filter-choice--active"
              : "filter-choice"
          }
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
          key={discount}
          type="button"
          className={
            discountFilter === discount
              ? "filter-choice filter-choice--active"
              : "filter-choice"
          }
          onClick={() => setDiscountFilter(discount)}
        >
          {discount}% Off
        </button>
      ))}
    </div>

    <div className="filter-group">
      <h3>Brand</h3>

      <select
        value={brandFilter}
        onChange={(event) =>
          setBrandFilter(event.target.value)
        }
      >
        <option>All</option>

        {brands.map((brand) => (
          <option key={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  </aside>

  <div
    className="product-browsing"
    ref={productBrowsingRef}
  >
    <div className="browse-toolbar">
      <div className="browse-context">
        <div>
          <span>
            {searchTerm
              ? "Search results"
              : "Showing now"}
          </span>

          <strong>
            {searchTerm
              ? searchTerm
              : activeCategory}
          </strong>
        </div>

        <p>
          {filteredProducts.length}
          {" "}products
        </p>

        {searchTerm ? (
          <button
            className="filter-reset"
            type="button"
            onClick={clearSearch}
          >
            Clear
          </button>
        ) : null}
      </div>

      <label
        className="sort-control"
        htmlFor="sort-products"
      >
        <span>Sort</span>

        <select
          id="sort-products"
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value)
          }
        >
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
        <p className="customer-eyebrow">
          {activeCategory}
        </p>

        <h2>
          {filteredProducts.length}
          {" "}premium products found
        </h2>
      </div>

      <span>
        Live filters active
      </span>
    </div>

    <div className="marketplace-product-grid">
      {filteredProducts.map(
        (product) => (
          <ProductCard
            product={product}
            key={product.id}
            onQuickView={
              setSelectedProduct
            }
          />
        )
      )}
    </div>

    {filteredProducts.length === 0 && (
      <div className="empty-browse-state">
        <h2>
          No products matched
          these filters.
        </h2>

        <p>
          Try another category,
          brand or price range.
        </p>
      </div>
    )}
  </div>
</section>
      <section
        className="product-browsing"
        ref={productBrowsingRef}
      >
        <div className="browse-toolbar">
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

          <select
            value={priceFilter}
            onChange={(event) =>
              setPriceFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Prices
            </option>

            {priceRanges.map((range) => (
              <option
                key={range.label}
                value={range.label}
              >
                {range.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value
              )
            }
          >
            <option>
              Most Popular
            </option>

            <option>
              Price Low to High
            </option>

            <option>
              Price High to Low
            </option>
          </select>
        </div>

        <div className="marketplace-product-grid">
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;