import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSavedUser } from "../../api/auth";
import { searchAdmin } from "../../services/adminService";
import { getNotifications } from "../../services/notificationService";

function Navbar() {
  const navigate = useNavigate();
  const savedUser = getSavedUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getNotifications()
      .then((data) => {
        if (isMounted) {
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUnreadCount(0);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const query = searchTerm.trim();

    if (query.length < 2) {
      return undefined;
    }

    let ignoreResult = false;

    const timer = window.setTimeout(() => {
      searchAdmin(query)
        .then((data) => {
          if (ignoreResult) return;
          setSearchResults(data.results || []);
          setSearchError("");
        })
        .catch((error) => {
          if (ignoreResult) return;
          setSearchResults([]);
          setSearchError(error.message || "Search failed.");
        })
        .finally(() => {
          if (!ignoreResult) {
            setIsSearching(false);
          }
        });
    }, 250);

    return () => {
      ignoreResult = true;
      window.clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setSearchError("");
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const initials =
    savedUser?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "VA";

  return (
    <header className="admin-navbar">
      <form
        className="admin-search"
        onSubmit={(event) => {
          event.preventDefault();
          const query = searchTerm.trim();
          if (query && searchResults[0]?.url) {
            navigate(searchResults[0].url);
            setSearchTerm("");
          }
        }}
      >
        <span>Search</span>
        <input
          id="admin-search"
          type="search"
          placeholder="Search orders, vendors, products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm.trim().length >= 2 ? (
          <div className="admin-search-results">
            {isSearching ? <div className="admin-search-state">Searching...</div> : null}
            {!isSearching && searchError ? <div className="admin-search-state admin-search-state--error">{searchError}</div> : null}
            {!isSearching && !searchError && searchResults.length === 0 ? (
              <div className="admin-search-state">No results found.</div>
            ) : null}
            {!isSearching &&
              !searchError &&
              searchResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  type="button"
                  onClick={() => {
                    navigate(result.url);
                    setSearchTerm("");
                  }}
                >
                  <strong>{result.title}</strong>
                  <span>{result.type} - {result.subtitle}</span>
                </button>
              ))}
          </div>
        ) : null}
      </form>

      <div className="navbar-actions">
        <Link className="icon-button" to="/admin/notifications" aria-label="Open notifications">
          N
          {unreadCount > 0 ? (
            <span className="notification-count">{unreadCount > 9 ? "9+" : unreadCount}</span>
          ) : null}
        </Link>

        <div className="profile-menu">
          <button
            className="profile-card profile-card--button"
            type="button"
            aria-expanded={isProfileOpen}
            aria-label="Admin profile"
            onClick={() => setIsProfileOpen((current) => !current)}
          >
          <div className="profile-avatar">
            {savedUser?.avatar ? <img src={savedUser.avatar} alt={savedUser?.name || "Admin"} /> : initials}
          </div>
          <div>
            <strong>{savedUser?.name || "V SHOP Admin"}</strong>
            <span>Founder workspace</span>
          </div>
          </button>
          {isProfileOpen ? (
            <div className="profile-dropdown">
              <button type="button" onClick={() => navigate("/admin/profile")}>View Profile</button>
              <button type="button" onClick={handleLogout}>Logout</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
