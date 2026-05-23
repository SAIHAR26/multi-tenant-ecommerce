import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar__logo" href="/">
        <span className="navbar__logo-mark">V</span>
        <span className="navbar__logo-text">SHOP</span>
      </a>

      <nav className="navbar__links" aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="#collections">Collections</a>
        <a href="#top-vendors">Top Vendors</a>
        <a href="#connect">Connect</a>
      </nav>

      <a className="navbar__login" href="/login">
        Signup / Login
      </a>
    </header>
  );
}

export default Navbar;
