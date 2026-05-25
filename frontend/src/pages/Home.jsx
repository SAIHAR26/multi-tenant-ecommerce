import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProducts } from "../services/productService";
import { getStores } from "../services/storeService";
import defaultProduct from "../assets/default-product.png";
import defaultStore from "../assets/default-store.jpg";
import { getProductImage } from "../utils/productImages";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH PRODUCTS + STORES
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsData, storesData] = await Promise.all([
          getProducts(),
          getStores(),
        ]);

        const productsArray = Array.isArray(productsData?.products)
          ? productsData.products
          : Array.isArray(productsData)
          ? productsData
          : [];

        const storesArray = Array.isArray(storesData)
          ? storesData
          : [];

        setProducts(productsArray);
        setStores(storesArray);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero__glow hero__glow--red" />
          <div className="hero__glow hero__glow--soft" />

          <div className="hero__content">
            <p className="eyebrow">
              Premium multi-vendor ecommerce
            </p>

            <h1>
              Discover fashion from stores built to stand out.
            </h1>

            <p className="hero__slogan">
              One Platform. Infinite Stores.
            </p>

            <div className="hero__actions">
              <a
                className="btn btn--primary"
                href="#collections"
              >
                Shop Now
              </a>

              <a
                className="btn btn--secondary"
                href="/register"
              >
                Become Vendor
              </a>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section
          className="section"
          id="collections"
        >
          <div className="section__header">
            <p className="eyebrow">
              Featured products
            </p>

            <h2>
              Fresh drops from premium vendors
            </h2>
          </div>

          {loading && (
            <p>Loading products...</p>
          )}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <div className="product-grid">
              {products.length > 0 ? (
                products
                  .slice(0, 6)
                  .map((product) => (
                    <article
                      className="product-card"
                      key={product._id}
                    >
                      <div className="product-card__image">
                        <img
                          src={
                            product.images?.[0] ||
                            product.image ||
                            defaultProduct
                          }
                          alt={product.name}
                        />
                products.slice(0, 6).map((product) => (
                  <article
                    className="product-card"
                    key={product._id}
                  >
                    <div className="product-card__image">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                      />
                    </div>

                    <div className="product-card__body">
                      <div>
                        <h3>{product.name}</h3>
                        <p>{product.brand || "V SHOP"}</p>
                      </div>

                      <div className="product-card__body">
                        <div>
                          <h3>
                            {product.name}
                          </h3>

                          <p>
                            {product.brand ||
                              "V SHOP"}
                          </p>
                        </div>

                        <div className="product-card__meta">
                          <span>
                            ₹
                            {new Intl.NumberFormat(
                              "en-IN"
                            ).format(
                              product.price || 0
                            )}
                          </span>

                          <span>
                            ★{" "}
                            {product.rating ||
                              4}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
              ) : (
                <p>
                  No products available
                </p>
              )}
            </div>
          )}
        </section>

        {/* VENDORS */}
        <section
          className="section section--vendors"
          id="top-vendors"
        >
          <div className="section__header">
            <p className="eyebrow">
              Top vendors
            </p>

            <h2>
              Stores customers keep coming back to
            </h2>
          </div>

          <div className="vendor-grid">
            {stores.map((store) => (
              <article
                className="vendor-card"
                key={store._id}
              >
                <div className="vendor-card__image">
                  <img
                    src={
                      store.storeBanner ||
                      store.storeLogo ||
                      defaultStore
                    }
                    alt={store.storeName}
                  />
                </div>

                <div>
                  <h3>
                    {store.storeName}
                  </h3>

                  <p>
                    {store.storeDescription ||
                      store.storeCategory}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CONNECT */}
        <section
          className="connect-strip"
          id="connect"
        >
          <div>
            <p className="eyebrow">
              Connect
            </p>

            <h2>
              Launch, shop, and scale inside one
              premium marketplace.
            </h2>

            <div
              className="connect-details"
              aria-label="Contact details"
            >
              <a href="mailto:support@vshop.com">
                support@vshop.com
              </a>

              <a href="tel:+919000000000">
                +91 90000 00000
              </a>

              <span>
                Partner support: Hyderabad, India
              </span>
            </div>
          </div>

          <a
            className="btn btn--primary"
            href="/register"
          >
            Join V SHOP
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;