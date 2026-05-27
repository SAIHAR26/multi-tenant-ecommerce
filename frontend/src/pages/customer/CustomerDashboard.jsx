import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../../components/customer/ProductCard";
import { getProducts } from "../../services/productService";
import { getProductImage } from "../../utils/productImages";
import { getDiverseProducts } from "../../utils/productSelection";
import { categoryTabs, priceRanges } from "./customerData";

const ratingFilters = [1, 2, 3, 4, 5];
const CUSTOMER_DASHBOARD_PRODUCT_LIMIT = 3;

const discountFilters = [
  10,
  20,
  30,
  40,
  50,
];

const normalizeText = (value) => value?.toString().toLowerCase().trim() || "";

const categoryAliases = {
  shoes: ["shoes", "shoe", "footwear", "sneaker", "sneakers", "runner", "running"],
};

const exactCategoryTabs = new Set([
  "men",
  "women",
  "dresses",
  "kids",
  "electronics",
  "shoes",
  "accessories",
  "books",
]);

const normalizeProduct = (product) => ({
  ...product,

  id: product.id || product._id,

  _id: product._id || product.id,
  image: getProductImage(product),
  discount: product.discount || 0,
  popularity: product.popularity || product.rating || 0,
});

function CustomerDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const productBrowsingRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("Trending");

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

  const searchTerm =
    searchParams.get("search") || "";

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        const productsArray = Array.isArray(
          data?.products
        )
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        setProducts(
          productsArray.map(normalizeProduct)
        );

        setError("");
      } catch (err) {
        console.error(err);

        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // SCROLL TO PRODUCTS
  useEffect(() => {
    if (searchTerm) {
      productBrowsingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchTerm]);

  // CLEAR SEARCH
  const clearSearch = () => {
    const nextSearchParams =
      new URLSearchParams(searchParams);

    nextSearchParams.delete("search");

    setSearchParams(nextSearchParams, {
      replace: true,
    });
  };

  // DYNAMIC BRANDS
  const brands = useMemo(() => {
    return [
      ...new Set(
        products
          .map(
            (product) => product?.brand
          )
          .filter(Boolean)
      ),
    ];
  }, [products]);

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    const selectedPriceRange =
      priceRanges.find(
        (range) =>
          range.label === priceFilter
      );

    return products
      .filter((product) => {
        const productName = normalizeText(product?.name);
        const productBrand = normalizeText(product?.brand);
        const productCategory = normalizeText(product?.category);
        const productDescription = normalizeText(product?.description);
        const productStore = normalizeText(
          product?.storeId?.storeName || product?.storeId?.storeCategory || product?.vendor
        );
        const normalizedSearch = normalizeText(searchTerm);
        const normalizedCategory = normalizeText(activeCategory);
        const searchableText = [
          productName,
          productBrand,
          productCategory,
          productDescription,
          productStore,
        ].join(" ");

        const productPrice =
          Number(product?.price) || 0;

        const productRating =
          Number(product?.rating) || 0;

        const productDiscount =
          Number(product?.discount) || 0;

        const categoryTerms = categoryAliases[normalizedCategory] || [normalizedCategory];
        const matchesCategory =
          activeCategory === "Trending" || activeCategory === "New Arrivals"
            ? true
            : exactCategoryTabs.has(normalizedCategory)
            ? productCategory === normalizedCategory ||
              categoryTerms.includes(productCategory)
            : categoryTerms.some((term) => searchableText.includes(term));

        const matchesSearch =
          !normalizedSearch || searchableText.includes(normalizedSearch);

        const matchesPrice =
          selectedPriceRange
            ? productPrice >=
                selectedPriceRange.min &&
              productPrice <=
                selectedPriceRange.max
            : true;

        const matchesRating =
          ratingFilter === 0 ||
          productRating >= ratingFilter;

        const matchesDiscount =
          discountFilter === 0 ||
          productDiscount >=
            discountFilter;

        const matchesBrand =
          brandFilter === "All"
            ? true
            : product?.brand === brandFilter;

        return (
          matchesCategory &&
          matchesSearch &&
          matchesPrice &&
          matchesRating &&
          matchesDiscount &&
          matchesBrand
        );
      })
      .sort((a, b) => {
        const priceA =
          Number(a?.price) || 0;

        const priceB =
          Number(b?.price) || 0;

        if (
          sortBy ===
          "Price Low to High"
        ) {
          return priceA - priceB;
        }

        if (
          sortBy ===
          "Price High to Low"
        ) {
          return priceB - priceA;
        }

        return (
          (Number(b?.popularity) || 0) -
          (Number(a?.popularity) || 0)
        );
      });
  }, [
    products,
    activeCategory,
    searchTerm,
    priceFilter,
    ratingFilter,
    discountFilter,
    brandFilter,
    sortBy,
  ]);

  const visibleProducts = getDiverseProducts(
    filteredProducts,
    CUSTOMER_DASHBOARD_PRODUCT_LIMIT
  );

  return (
    <div className="customer-page">
      {/* HERO */}
      <section className="marketplace-hero">
        <div className="marketplace-hero__content">
          <p className="customer-eyebrow">
            Festival Sale live now
          </p>

          <h1>
            Luxury marketplace drops,
            curated for every cart.
          </h1>

          <p>
            Explore premium fashion,
            electronics, books,
            shoes, accessories, and
            daily deals from verified
            V SHOP vendors.
          </p>

          <div className="marketplace-hero__actions">
            <button
              className="customer-primary-button"
              type="button"
            >
              Shop Now
            </button>

            <span>
              Up to 50% off on flash
              picks
            </span>
          </div>
        </div>

        <div className="marketplace-hero__deal">
          <span>Featured Offer</span>

          <strong>
            Premium Collection
          </strong>

          <p>
            Extra 15% off on luxe
            accessories and red-tag
            sneakers tonight.
          </p>
        </div>
      </section>

      {/* OFFER BANNERS */}
      <section className="offer-banner-grid">
        {[
          "Festival Sale",
          "Limited Offer",
          "Premium Collection",
          "Flash Sale",
        ].map((offer, index) => (
          <article
            className="offer-banner"
            key={offer}
          >
            <span>
              0{index + 1}
            </span>

            <h2>{offer}</h2>

            <p>
              {index % 2 === 0
                ? "Red hot vendor deals"
                : "Members-only luxury prices"}
            </p>
          </article>
        ))}
      </section>

      {/* CATEGORY */}
      <section className="category-strip">
        {categoryTabs.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-pill ${
              activeCategory === category
                ? "category-pill--active"
                : ""
            }`}
            onClick={() =>
              setActiveCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </section>

      {/* MAIN LAYOUT */}
      <section className="marketplace-layout">
        {/* FILTER PANEL */}
        <aside className="filter-panel" aria-label="Product filters">
          <div className="filter-panel__header">
            <p className="customer-eyebrow">
              Filters
            </p>

            <button
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

          {/* PRICE */}
          <div className="filter-group">
            <h3>Price Range</h3>

            {[
              "All",
              ...priceRanges.map(
                (range) => range.label
              ),
            ].map((range) => (
              <button
                key={range}
                className={
                  priceFilter === range
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPriceFilter(range)
                }
              >
                {range}
              </button>
            ))}
          </div>

          {/* RATING */}
          <div className="filter-group">
            <h3>Rating</h3>

            {ratingFilters.map(
              (rating) => (
                <button
                  key={rating}
                  type="button"
                  className={
                    ratingFilter ===
                    rating
                      ? "filter-choice filter-choice--active"
                      : "filter-choice"
                  }
                  onClick={() =>
                    setRatingFilter(rating)
                  }
                >
                  {rating} star and above
                </button>
              )
            )}
          </div>

          {/* DISCOUNT */}
          <div className="filter-group">
            <h3>Discount</h3>

            {discountFilters.map(
              (discount) => (
                <button
                  key={discount}
                  className={
                    discountFilter ===
                    discount
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setDiscountFilter(
                      discount
                    )
                  }
                >
                  {discount}%+
                </button>
              )
            )}
          </div>

          {/* BRAND */}
          <div className="filter-group">
            <h3>Brand</h3>

            <select
              value={brandFilter}
              onChange={(e) =>
                setBrandFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All
              </option>

              {brands.map((brand) => (
                <option
                  key={brand}
                  value={brand}
                >
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div
          className="product-browsing"
          ref={productBrowsingRef}
        >
          {/* TOOLBAR */}
          <div className="browse-toolbar">
            <div>
              <strong>
                {searchTerm
                  ? searchTerm
                  : activeCategory}
              </strong>

              <p>
                {filteredProducts.length}{" "}
                products
              </p>
            </div>

            {searchTerm && (
              <button
                onClick={clearSearch}
              >
                Clear
              </button>
            )}

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
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

          {/* LOADING */}
          {loading && (
            <p>Loading products...</p>
          )}

          {/* ERROR */}
          {!loading && error && (
            <p>{error}</p>
          )}

          {/* PRODUCT GRID */}
          {/* PRODUCTS */}
          {!loading &&
            !error &&
            (visibleProducts.length > 0 ? (
              <div className="marketplace-product-grid">
                {visibleProducts.map(
                  (product) => (
                    <ProductCard
                      key={
                        product._id ||
                        product.id
                      }
                      product={product}
                      allProducts={
                        products
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="empty-products">
                <h3>
                  No products found
                </h3>

                <p>
                  Try changing filters.
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;
