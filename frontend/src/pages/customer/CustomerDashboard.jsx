import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { categoryTabs, priceRanges, products as fallbackProducts } from "./customerData";
import { getProducts } from "../../services/productService";

const ratingFilters = [1, 2, 3, 4, 5];
const discountFilters = [10, 20, 30, 40, 50];
const ratingFilters = [4, 3];
const discountFilters = [10, 25, 50];

const normalizeProduct = (product) => ({
  ...product,
  id: product.id || product._id,
  _id: product._id || product.id,
  image: product.image || product.images?.[0] || "https://via.placeholder.com/300",
  discountPercent: product.discountPercent ?? product.discount ?? 0,
  isTrending: product.isTrending ?? Number(product.rating || 0) >= 4.5,
  isNew: product.isNew ?? false,
  popularity: product.popularity ?? product.rating ?? 0,
  vendor: product.vendor?.name || product.vendor || product.storeId?.storeName || "V SHOP",
});

function CustomerDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productBrowsingRef = useRef(null);
  const [products, setProducts] = useState(fallbackProducts.map(normalizeProduct));
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
  const [activeCategory, setActiveCategory] = useState("Trending");
  const searchTerm = searchParams.get("search") || "";
  const [priceFilter, setPriceFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [discountFilter, setDiscountFilter] = useState(0);
  const [brandFilter, setBrandFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Most Popular");

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))].sort(),
    [products]
  );

  useEffect(() => {
    let isMounted = true;

    getProducts()
      .then((data) => {
        if (!isMounted) return;

        const productsArray = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];

        if (productsArray.length > 0) {
          setProducts(productsArray.map(normalizeProduct));
        }

        setError("");
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Using offline products.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

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
    return () => {
      isMounted = false;
    };
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
  useEffect(() => {
    if (searchTerm) {
      productBrowsingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchTerm]);

  // CLEAR SEARCH
  const clearSearch = () => {
    const nextSearchParams =
      new URLSearchParams(searchParams);
    const nextSearchParams = new URLSearchParams(searchParams);

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
  }, [activeCategory, brandFilter, discountFilter, priceFilter, products, ratingFilter, searchTerm, sortBy]);

  return (
    <div className="customer-page marketplace-home">
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

      {/* MAIN LAYOUT */}
      <section className="marketplace-layout">
        {/* FILTER PANEL */}
        <aside className="filter-panel">
          <div className="filter-panel__header">
            <p>Filters</p>

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

          {/* PRICE FILTER */}
          <div className="filter-group">
            <h3>Price</h3>

            {[
              "All",
              ...priceRanges.map(
                (r) => r.label
              ),
            ].map((range) => (
          <div className="filter-group">
            <h3>Price Range</h3>
            {["All", ...priceRanges.map((range) => range.label)].map((range) => (
              <button
                className={priceFilter === range ? "filter-choice filter-choice--active" : "filter-choice"}
                key={range}
                className={
                  priceFilter === range
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPriceFilter(range)
                }
                type="button"
                onClick={() => setPriceFilter(range)}
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
            <span>{loading ? "Loading products..." : "Live filters active"}</span>
          </div>

          {error ? <p className="customer-inline-alert">{error}</p> : null}

          <div className="marketplace-product-grid">
            {filteredProducts.map((product) => (
              <ProductCard product={product} allProducts={products} key={product._id || product.id} />
            ))}
          </div>

          {!loading && filteredProducts.length === 0 ? (
            <div className="empty-browse-state">
              <h2>No products matched these filters.</h2>
              <p>Try a wider price range, another brand, or a different category.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;
