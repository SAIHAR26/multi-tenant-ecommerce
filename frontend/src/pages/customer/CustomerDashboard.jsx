import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { categoryTabs, priceRanges } from "./customerData";
import { getProducts } from "../../services/productService";

const ratingFilters = [1, 2, 3, 4, 5];
const discountFilters = [10, 20, 30, 40, 50];
const brands = ["Nike", "Adidas", "Puma", "Zara"];

function CustomerDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productBrowsingRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("Trending");
  const searchTerm = searchParams.get("search") || "";

  const [priceFilter, setPriceFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [discountFilter, setDiscountFilter] = useState(0);
  const [brandFilter, setBrandFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Most Popular");

  // ✅ FETCH FROM SERVICE
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        const productsArray = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        setProducts(productsArray);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ SCROLL ON SEARCH
  useEffect(() => {
    if (searchTerm) {
      productBrowsingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchTerm]);

  const clearSearch = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("search");
    setSearchParams(nextSearchParams, { replace: true });
  };

  // ✅ FILTER + SORT
  const filteredProducts = useMemo(() => {
    const selectedPriceRange = priceRanges.find(
      (range) => range.label === priceFilter
    );

    return products
      .filter((product) => {
        const matchesCategory =
          activeCategory === "Trending"
            ? product?.isTrending
            : product?.category === activeCategory;

        const matchesSearch = [product?.name, product?.brand]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesPrice = selectedPriceRange
          ? product?.price >= selectedPriceRange.min &&
            product?.price <= selectedPriceRange.max
          : true;

        const matchesRating =
          ratingFilter === 0 || product?.rating >= ratingFilter;

        const matchesDiscount =
          discountFilter === 0 || product?.discount >= discountFilter;

        const matchesBrand =
          brandFilter === "All" || product?.brand === brandFilter;

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
        if (sortBy === "Price Low to High") return a.price - b.price;
        if (sortBy === "Price High to Low") return b.price - a.price;
        return (b.popularity || 0) - (a.popularity || 0);
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
        <p>Explore premium products from verified vendors.</p>
      </section>

      {/* CATEGORY */}
      <section className="category-strip">
        {categoryTabs.map((category) => (
          <button key={category} onClick={() => setActiveCategory(category)}>
            {category}
          </button>
        ))}
      </section>

      {/* MAIN */}
      <section className="marketplace-layout">
        {/* FILTERS */}
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

          {/* PRICE */}
          <div className="filter-group">
            <h3>Price</h3>
            {["All", ...priceRanges.map((r) => r.label)].map((range) => (
              <button
                key={range}
                className={priceFilter === range ? "active" : ""}
                onClick={() => setPriceFilter(range)}
              >
                {range}
              </button>
            ))}
          </div>

          {/* RATING */}
          <div className="filter-group">
            <h3>Rating</h3>
            {ratingFilters.map((r) => (
              <button
                key={r}
                className={ratingFilter === r ? "active" : ""}
                onClick={() => setRatingFilter(r)}
              >
                {r}+ stars
              </button>
            ))}
          </div>

          {/* DISCOUNT */}
          <div className="filter-group">
            <h3>Discount</h3>
            {discountFilters.map((d) => (
              <button
                key={d}
                className={discountFilter === d ? "active" : ""}
                onClick={() => setDiscountFilter(d)}
              >
                {d}%+
              </button>
            ))}
          </div>

          {/* BRAND */}
          <div className="filter-group">
            <h3>Brand</h3>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option>All</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="product-browsing" ref={productBrowsingRef}>
          <div className="browse-toolbar">
            <div>
              <strong>
                {searchTerm ? searchTerm : activeCategory}
              </strong>
              <p>{filteredProducts.length} products</p>
            </div>

            {searchTerm && (
              <button onClick={clearSearch}>Clear</button>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Most Popular</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
            </select>
          </div>

          {/* STATES */}
          {loading && <p>Loading products...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <div className="marketplace-product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product?._id}
                    product={product}
                    allProducts={products}
                  />
                ))
              ) : (
                <p>No products found for selected filters</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;