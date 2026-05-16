import "./Navbar.css";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("vshopToken");
  const logout = () => {
    localStorage.removeItem("vshopToken");
    localStorage.removeItem("vshopUser");
    navigate("/login");
  };
  return (
    <header className="navbar">
      <a className="navbar__logo" href="/">
        <span className="navbar__logo-mark">V</span>
        <span className="navbar__logo-text">
          VSHOP
        </span>
      </a>
      <nav
        className="navbar__links"
        aria-label="Primary navigation"
      >
        <a href="/">Home</a>
        <a href="#collections">Collections</a>
        <a href="#reviews">Reviews</a>
        <a href="#connect">Connect</a>
      </nav>
      {
        token ? (
          <button
            className="navbar__login"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <a
            className="navbar__login"
            href="/login"
          >
            Signup / Login
          </a>
        )
      }
    </header>
  );
}
export default Navbar;