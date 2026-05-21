import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProducts } from "../services/productService";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH PRODUCTS FROM API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        const productsArray =
          Array.isArray(data?.products)
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
            <p className="eyebrow">Premium multi-vendor ecommerce</p>

            <h1>
              Discover fashion from stores built to stand out.
            </h1>

            <p className="hero__slogan">
              One Platform. Infinite Stores.
            </p>

            <div className="hero__actions">
              <a className="btn btn--primary" href="#collections">
                Shop Now
              </a>

              <a className="btn btn--secondary" href="/register">
                Become Vendor
              </a>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="section" id="collections">
          <div className="section__header">
            <p className="eyebrow">Featured products</p>
            <h2>Fresh drops from premium vendors</h2>
          </div>

          {/* ✅ STATES */}
          {loading && <p>Loading products...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <div className="product-grid">
              {products.length > 0 ? (
                products.slice(0, 6).map((product) => (
                  <article
                    className="product-card"
                    key={product._id}
                  >
                    <div className="product-card__image">
                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                      />
                    </div>

                    <div className="product-card__body">
                      <div>
                        <h3>{product.name}</h3>
                        <p>{product.brand || "V SHOP"}</p>
                      </div>

                      <div className="product-card__meta">
                        <span>
                          ₹
                          {new Intl.NumberFormat("en-IN").format(
                            product.price || 0
                          )}
                        </span>
                        <span>★ {product.rating || 4}</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          )}
        </section>

        {/* ✅ KEEP VENDORS STATIC */}
        <section className="section section--vendors">
          <div className="section__header">
            <p className="eyebrow">Top vendors</p>
            <h2>Stores customers keep coming back to</h2>
          </div>

          <div className="vendor-grid">
            <article className="vendor-card">
              <div className="vendor-card__image">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                  alt="Vendor"
                />
              </div>
              <div>
                <h3>Urban Vault</h3>
                <p>Curated premium streetwear</p>
              </div>
            </article>
          </div>
        </section>

        {/* CONNECT */}
        <section className="connect-strip">
          <div>
            <p className="eyebrow">Connect</p>
            <h2>
              Launch, shop, and scale inside one premium marketplace.
            </h2>
          </div>

          <a className="btn btn--primary" href="/register">
            Join V SHOP
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;