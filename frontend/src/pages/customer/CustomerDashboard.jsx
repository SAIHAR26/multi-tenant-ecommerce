import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import {
  categoryTabs,
  priceRanges,
  products,
} from "./customerData";

function CustomerDashboard() {
  const [searchParams] = useSearchParams();

  const productBrowsingRef = useRef(null);

  const [activeCategory, setActiveCategory] =
    useState("Trending");

  const [searchTerm, setSearchTerm] =
    useState(
      searchParams.get("search") || ""
    );

  const [priceFilter, setPriceFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Most Popular");

  useEffect(() => {
    const querySearchTerm =
      searchParams.get("search") || "";

    if (querySearchTerm) {
      productBrowsingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const selectedPriceRange =
      priceRanges.find(
        (range) =>
          range.label === priceFilter
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
            className={
              activeCategory === category
                ? "active-category"
                : ""
            }
            onClick={() =>
              setActiveCategory(category)
            }
          >
            {category}
          </button>
        ))}
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

        {filteredProducts.length > 0 ? (
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
        ) : (
          <div className="empty-products">
            <h2>
              No products found
            </h2>

            <p>
              Try another search or
              filter.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default CustomerDashboard;