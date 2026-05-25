import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getUsers } from "../../services/userService";

function CustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getUsers()
      .then((users) => {
        if (!isMounted) return;
        setCustomers((Array.isArray(users) ? users : []).filter((user) => user.role === "customer"));
        setError("");
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Customers could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return customers;

    return customers.filter((customer) =>
      [customer.name, customer.email, customer.location, customer.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [customers, searchTerm]);

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Customer intelligence</p>
          <h1>Understand premium shoppers.</h1>
          <p>Track registered customers, account status, and profile signals from MongoDB.</p>
        </div>
        <button className="hero-action" type="button" onClick={() => navigate("/admin/customer-segments")}>
          Create Segment
        </button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple"><div className="dashboard-card__top"><span>Total Customers</span><strong>Live</strong></div><h2>{customers.length}</h2><p>Registered accounts</p></article>
        <article className="dashboard-card dashboard-card--blue"><div className="dashboard-card__top"><span>Active Customers</span><strong>MongoDB</strong></div><h2>{customers.filter((customer) => customer.isActive !== false).length}</h2><p>Can place orders</p></article>
        <article className="dashboard-card dashboard-card--cyan"><div className="dashboard-card__top"><span>With Phone</span><strong>Profile</strong></div><h2>{customers.filter((customer) => customer.phone).length}</h2><p>Contact-ready profiles</p></article>
        <article className="dashboard-card dashboard-card--violet"><div className="dashboard-card__top"><span>With Location</span><strong>Profile</strong></div><h2>{customers.filter((customer) => customer.location).length}</h2><p>Delivery signal available</p></article>
      </section>

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div><p className="admin-eyebrow">Customers</p><h2>Recent customer activity</h2></div>
            <input
              className="panel-search"
              type="search"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {loading ? <LoadingState message="Loading customers..." /> : null}
          {!loading && error ? <ErrorState title="Unable to load customers" message={error} /> : null}
          {!loading && !error && visibleCustomers.length === 0 ? <ErrorState title="No customers" message="No customers matched this view." /> : null}

          {!loading && !error && visibleCustomers.length > 0 ? (
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Location</th><th>Status</th></tr></thead>
                <tbody>
                  {visibleCustomers.map((customer) => (
                    <tr key={customer._id || customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone || "Not added"}</td>
                      <td>{customer.location || "Not added"}</td>
                      <td><span className={`status-badge status-badge--${customer.isActive === false ? "review" : "live"}`}>{customer.isActive === false ? "Inactive" : "Live"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Retention</p><h2>Customer signals</h2></div></div>
          <div className="bar-chart" aria-label="Customer profile completeness">
            {[customers.length, customers.filter((customer) => customer.phone).length, customers.filter((customer) => customer.location).length, visibleCustomers.length].map((value, index) => {
              const height = customers.length ? Math.max(12, Math.round((value / customers.length) * 100)) : 12;
              return <span key={`${value}-${index}`} style={{ "--bar-height": `${height}%` }} />;
            })}
          </div>
        </article>
      </section>
    </div>
  );
}

export default CustomersPage;
