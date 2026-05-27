import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../../components/customer/ProductCard";
import { getProducts } from "../../services/productService";
import { getProductImage } from "../../utils/productImages";
import { getDiverseProducts } from "../../utils/productSelection";
import { categoryTabs, priceRanges } from "./customerData";

const ratingFilters = [1, 2, 3, 4, 5];
const CUSTOMER_DASHBOARD_PRODUCT_LIMIT = 3;

const discountFilters = [10, 20, 30, 40, 50];

const normalizeText = (value) =>
  value?.toString().toLowerCase().trim() || "";

const categoryAliases = {
  shoes: ["shoes", "shoe", "footwear", "sneaker", "sneakers"],
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        const productsArray = Array.isArray(data?.products)
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

    setSearchParams(nextSearchParams, {
      replace: true,
    });
  };

  const brands = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product?.brand)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const selectedPriceRange =
      priceRanges.find(
        (range) => range.label === priceFilter
      );

    return products
      .filter((product) => {
        const productName = normalizeText(product?.name);

        const productBrand = normalizeText(product?.brand);

        const productCategory = normalizeText(product?.category);

        const productDescription = normalizeText(
          product?.description
        );

        const normalizedSearch =
          normalizeText(searchTerm);

        const normalizedCategory =
          normalizeText(activeCategory);

        const searchableText = [
          productName,
          productBrand,
          productCategory,
          productDescription,
        ].join(" ");

        const productPrice =
          Number(product?.price) || 0;

        const productRating =
          Number(product?.rating) || 0;

        const productDiscount =
          Number(product?.discount) || 0;

        const categoryTerms =
          categoryAliases[normalizedCategory] || [
            normalizedCategory,
          ];

        const matchesCategory =
          activeCategory === "Trending"
            ? true
            : exactCategoryTabs.has(normalizedCategory)
            ? productCategory === normalizedCategory ||
              categoryTerms.includes(productCategory)
            : categoryTerms.some((term) =>
                searchableText.includes(term)
              );

        const matchesSearch =
          !normalizedSearch ||
          searchableText.includes(normalizedSearch);

        const matchesPrice =
          selectedPriceRange
            ? productPrice >= selectedPriceRange.min &&
              productPrice <= selectedPriceRange.max
            : true;

        const matchesRating =
          ratingFilter === 0 ||
          productRating >= ratingFilter;

        const matchesDiscount =
          discountFilter === 0 ||
          productDiscount >= discountFilter;

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
        const priceA = Number(a?.price) || 0;

        const priceB = Number(b?.price) || 0;

        if (sortBy === "Price Low to High") {
          return priceA - priceB;
        }

        if (sortBy === "Price High to Low") {
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
      <section className="marketplace-layout">
        <aside
          className="filter-panel"
          aria-label="Product filters"
        >
          <div className="filter-panel__header">
            <p>Filters</p>

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

          <div className="filter-group">
            <h3>Rating</h3>

            {ratingFilters.map((rating) => (
              <button
                key={rating}
                className={
                  ratingFilter === rating
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setRatingFilter(rating)
                }
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
                className={
                  discountFilter === discount
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setDiscountFilter(discount)
                }
              >
                {discount}%+
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3>Brand</h3>

            <select
              value={brandFilter}
              onChange={(e) =>
                setBrandFilter(e.target.value)
              }
            >
              <option value="All">All</option>

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

        <div
          className="product-browsing"
          ref={productBrowsingRef}
        >
          <div className="browse-toolbar">
            <div>
              <strong>
                {searchTerm
                  ? searchTerm
                  : activeCategory}
              </strong>

              <p>
                {filteredProducts.length} products
              </p>
            </div>

            {searchTerm && (
              <button onClick={clearSearch}>
                Clear
              </button>
            )}

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
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

          {loading && <p>Loading products...</p>}

          {!loading && error && <p>{error}</p>}

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
                      allProducts={products}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="empty-products">
                <h3>No products found</h3>

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