import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

const featuredProducts = [
  {
    name: "Noir Street Jacket",
    price: "₹12,499",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Crimson Runner",
    price: "₹8,999",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Essential Leather Tote",
    price: "₹6,499",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",
  },
];

const topVendors = [
  {
    name: "Urban Vault",
    description: "Curated premium streetwear and elevated daily essentials.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Luxe Lane",
    description: "Modern accessories from independent fashion labels.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Redline Studio",
    description: "Limited drops, statement pieces, and refined silhouettes.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
];

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero__glow hero__glow--red" />
          <div className="hero__glow hero__glow--soft" />

          <div className="hero__content">
            <p className="eyebrow">Premium multi-vendor ecommerce</p>
            <h1>Discover fashion from stores built to stand out.</h1>
            <p className="hero__slogan">One Platform. Infinite Stores.</p>

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

        <section className="section" id="collections">
          <div className="section__header">
            <p className="eyebrow">Featured products</p>
            <h2>Fresh drops from premium vendors</h2>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-card__image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-card__body">
                  <div>
                    <h3>{product.name}</h3>
                    <p>Vendor selected collection</p>
                  </div>
                  <div className="product-card__meta">
                    <span>{product.price}</span>
                    <span>★ {product.rating}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--vendors" id="reviews">
          <div className="section__header">
            <p className="eyebrow">Top vendors</p>
            <h2>Stores customers keep coming back to</h2>
          </div>

          <div className="vendor-grid">
            {topVendors.map((vendor) => (
              <article className="vendor-card" key={vendor.name}>
                <div className="vendor-card__image">
                  <img src={vendor.image} alt={vendor.name} />
                </div>
                <div>
                  <h3>{vendor.name}</h3>
                  <p>{vendor.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="connect-strip" id="connect">
          <div>
            <p className="eyebrow">Connect</p>
            <h2>Launch, shop, and scale inside one premium marketplace.</h2>
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
