import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { categoryTabs, priceRanges } from "./customerData";
import { getProducts } from "../../services/productService";

const ratingFilters = [1, 2, 3, 4, 5];
const discountFilters = [10, 20, 30, 40, 50];

function CustomerDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productBrowsingRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        console.log("API PRODUCTS:", data);

        const productsArray = Array.isArray(
          data?.products
        )
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        console.log(
          "FINAL PRODUCTS ARRAY:",
          productsArray
        );

        setProducts(productsArray);
      } catch (err) {
        console.error(
          "PRODUCT FETCH ERROR:",
          err
        );

        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // SCROLL TO PRODUCTS WHEN SEARCHING
  useEffect(() => {
    if (searchTerm) {
      productBrowsingRef.current?.scrollIntoView(
        {
          behavior: "smooth",
          block: "start",
        }
      );
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
    const uniqueBrands = [
      ...new Set(
        products
          .map((product) => product?.brand)
          .filter(Boolean)
      ),
    ];

    return uniqueBrands;
  }, [products]);

  // FILTER + SORT PRODUCTS
  const filteredProducts = useMemo(() => {
    const selectedPriceRange =
      priceRanges.find(
        (range) =>
          range.label === priceFilter
      );

    return products
      .filter((product) => {
        // SAFE VALUES
        const productName =
          product?.name
            ?.toString()
            .toLowerCase() || "";

        const productBrand =
          product?.brand
            ?.toString()
            .toLowerCase() || "";

        const productCategory =
          product?.category
            ?.toString()
            .toLowerCase() || "";

        const productPrice =
          Number(product?.price) || 0;

        const productRating =
          Number(product?.rating) || 0;

        const productDiscount =
          Number(product?.discount) || 0;

        // CATEGORY
        const matchesCategory =
          activeCategory === "Trending"
            ? true
            : productCategory ===
              activeCategory.toLowerCase();

        // SEARCH
        const matchesSearch =
          productName.includes(
            searchTerm.toLowerCase()
          ) ||
          productBrand.includes(
            searchTerm.toLowerCase()
          );

        // PRICE
        const matchesPrice =
          selectedPriceRange
            ? productPrice >=
                selectedPriceRange.min &&
              productPrice <=
                selectedPriceRange.max
            : true;

        // RATING
        const matchesRating =
          ratingFilter === 0 ||
          productRating >= ratingFilter;

        // DISCOUNT
        const matchesDiscount =
          discountFilter === 0 ||
          productDiscount >=
            discountFilter;

        // BRAND
        const matchesBrand =
          brandFilter === "All"
            ? true
            : productBrand ===
              brandFilter.toLowerCase();

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

  return (
    <div className="customer-page">
      {/* HERO */}
      <section className="marketplace-hero">
        <h1>V SHOP Marketplace</h1>

        <p>
          Explore premium products from
          verified vendors.
        </p>
      </section>

      {/* CATEGORY STRIP */}
      <section className="category-strip">
        {categoryTabs.map((category) => (
          <button
            key={category}
            className={
              activeCategory === category
                ? "active"
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

      {/* MAIN LAYOUT */}
      <section className="marketplace-layout">
        {/* FILTER PANEL */}
        <aside className="filter-panel">
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

          {/* PRICE FILTER */}
          <div className="filter-group">
            <h3>Price</h3>

            {[
              "All",
              ...priceRanges.map(
                (r) => r.label
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

          {/* RATING FILTER */}
          <div className="filter-group">
            <h3>Rating</h3>

            {ratingFilters.map(
              (rating) => (
                <button
                  key={rating}
                  className={
                    ratingFilter ===
                    rating
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setRatingFilter(
                      rating
                    )
                  }
                >
                  {rating}+ stars
                </button>
              )
            )}
          </div>

          {/* DISCOUNT FILTER */}
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

          {/* BRAND FILTER */}
          <div className="filter-group">
            <h3>Brand</h3>

            <select
              name="brandFilter"
              id="brandFilter"
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

        {/* PRODUCT SECTION */}
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
                {
                  filteredProducts.length
                }{" "}
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
              name="sortBy"
              id="sortBy"
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

          {/* PRODUCTS GRID */}
          {!loading && !error && (
            <>
              {filteredProducts.length >
              0 ? (
                <div className="marketplace-product-grid">
                  {filteredProducts.map(
                    (product) => (
                      <ProductCard
                        key={
                          product?._id ||
                          product?.id
                        }
                        product={{
                          ...product,
                          image:
                            product?.image ||
                            "https://dummyimage.com/300x300/cccccc/000000&text=Product",
                        }}
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
                    Current Category:{" "}
                    {activeCategory}
                  </p>

                  <p>
                    Available Products:{" "}
                    {products.length}
                  </p>

                  <p>
                    Search Term:{" "}
                    {searchTerm || "None"}
                  </p>

                  <p>
                    Try changing
                    category or
                    resetting filters.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;