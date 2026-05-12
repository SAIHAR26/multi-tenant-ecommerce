function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <h2>V SHOP</h2>
          <p>
            A premium multi-vendor marketplace for modern stores, sharp
            collections, and customers who expect more.
          </p>
        </div>

        <div>
          <h3>About</h3>
          <a href="#collections">Collections</a>
          <a href="#reviews">Top Vendors</a>
          <a href="/register">Become Vendor</a>
        </div>

        <div>
          <h3>Contact</h3>
          <a href="mailto:support@vshop.com">support@vshop.com</a>
          <a href="/login">Vendor Login</a>
          <a href="#connect">Partner Support</a>
        </div>

        <div>
          <h3>Social</h3>
          <a href="#connect">Instagram</a>
          <a href="#connect">LinkedIn</a>
          <a href="#connect">X</a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>V SHOP © 2026. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
