import { useEffect, useMemo, useState } from "react";
import {
  approveVendor,
  getVendorApprovals,
  getVendorProfile,
  rejectVendor,
} from "../../services/vendorApprovalService";

const filters = ["all", "pending", "approved", "rejected", "newest", "oldest"];

const fallbackSummary = {
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0,
};

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatCurrency = (value = 0) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "VS";

function VendorApprovalCenter() {
  const [vendors, setVendors] = useState([]);
  const [summary, setSummary] = useState(fallbackSummary);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState("");
  const [approvalTarget, setApprovalTarget] = useState(null);
  const [rejectionTarget, setRejectionTarget] = useState(null);
  const [profileVendor, setProfileVendor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getVendorApprovals({
      status: ["pending", "approved", "rejected"].includes(activeFilter) ? activeFilter : "all",
      sort: sortOrder,
    })
      .then((data) => {
        if (!isMounted) return;
        setVendors(data.vendors || []);
        setSummary(data.summary || fallbackSummary);
        setError("");
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Vendor requests could not be loaded.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilter, sortOrder]);


  const visibleVendors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return vendors.filter((vendor) => {
      if (
        ["pending", "approved", "rejected"].includes(activeFilter) &&
        vendor.approvalStatus !== activeFilter
      ) {
        return false;
      }

      if (!normalizedSearch) return true;

      return [vendor.name, vendor.email, vendor.store?.name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [activeFilter, searchTerm, vendors]);

  const handleFilterClick = (filter) => {
    if (filter === "newest" || filter === "oldest") {
      if (sortOrder === filter) return;
      setIsLoading(true);
      setSortOrder(filter);
      return;
    }

    if (activeFilter === filter) return;
    setIsLoading(true);
    setActiveFilter(filter);
  };

  const updateVendor = (updatedVendor) => {
    setVendors((currentVendors) => {
      const nextVendors = currentVendors.map((vendor) =>
        vendor.id === updatedVendor.id ? updatedVendor : vendor
      );

      setSummary((currentSummary) => {
        const nextSummary = nextVendors.reduce(
          (counts, vendor) => ({
            ...counts,
            [vendor.approvalStatus]: counts[vendor.approvalStatus] + 1,
            total: counts.total + 1,
          }),
          { pending: 0, approved: 0, rejected: 0, total: 0 }
        );

        return nextSummary.total ? nextSummary : currentSummary;
      });

      return nextVendors;
    });
  };

  const handleApprove = async () => {
    if (!approvalTarget) return;
    setIsWorking(true);
    setActionStatus("");

    try {
      const updatedVendor = await approveVendor(approvalTarget.id);
      updateVendor(updatedVendor);
      setApprovalTarget(null);
      setActionStatus(`${updatedVendor.store?.name || updatedVendor.name} approved.`);
    } catch (requestError) {
      setActionStatus(requestError.message || "Vendor could not be approved.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionTarget) return;
    setIsWorking(true);
    setActionStatus("");

    try {
      const updatedVendor = await rejectVendor(rejectionTarget.id, rejectionReason);
      updateVendor(updatedVendor);
      setRejectionTarget(null);
      setRejectionReason("");
      setActionStatus(`${updatedVendor.store?.name || updatedVendor.name} rejected.`);
    } catch (requestError) {
      setActionStatus(requestError.message || "Vendor could not be rejected.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleProfile = async (vendor) => {
    setActionStatus("");

    try {
      setProfileVendor(await getVendorProfile(vendor.id));
    } catch (requestError) {
      setActionStatus(requestError.message || "Vendor profile could not be loaded.");
    }
  };

  return (
    <div className="admin-page vendor-approval-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Vendor approval center</p>
          <h1>Vendor Verification Command Center</h1>
          <p>Review seller applications, verify stores and approve onboarding.</p>
        </div>
      </section>

      <section className="stats-grid" aria-label="Vendor approval statistics">
        <SummaryCard label="Pending Requests" value={summary.pending} tone="purple" />
        <SummaryCard label="Approved Vendors" value={summary.approved} tone="blue" />
        <SummaryCard label="Rejected Vendors" value={summary.rejected} tone="cyan" />
        <SummaryCard label="Total Vendors" value={summary.total} tone="violet" />
      </section>

      <section className="glass-panel vendor-approval-toolbar">
        <input
          className="panel-search vendor-approval-search"
          type="search"
          placeholder="Search vendor / email / store"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <div className="notification-filters" aria-label="Vendor approval filters">
          {filters.map((filter) => (
            <button
              className={`filter-chip ${
                activeFilter === filter || sortOrder === filter ? "filter-chip--active" : ""
              }`}
              key={filter}
              type="button"
              onClick={() => handleFilterClick(filter)}
            >
              {filter[0].toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {actionStatus ? <p className="vendor-action-status">{actionStatus}</p> : null}

      <section className="vendor-request-grid" aria-label="Vendor applications">
        {isLoading ? <div className="notification-state">Loading vendor requests...</div> : null}
        {!isLoading && error ? <div className="notification-state notification-state--error">{error}</div> : null}
        {!isLoading && !error && visibleVendors.length === 0 ? (
          <div className="notification-state">No vendors awaiting approval.</div>
        ) : null}
        {!isLoading &&
          !error &&
          visibleVendors.map((vendor) => (
            <VendorRequestCard
              key={vendor.id}
              vendor={vendor}
              onApprove={() => setApprovalTarget(vendor)}
              onProfile={() => handleProfile(vendor)}
              onReject={() => setRejectionTarget(vendor)}
            />
          ))}
      </section>

      {approvalTarget ? (
        <Modal title="Approve vendor" onClose={() => setApprovalTarget(null)}>
          <p className="modal-copy">Approve vendor: {approvalTarget.store?.name || approvalTarget.name}?</p>
          <div className="modal-actions">
            <button className="text-button" type="button" onClick={() => setApprovalTarget(null)}>
              Cancel
            </button>
            <button className="hero-action" disabled={isWorking} type="button" onClick={handleApprove}>
              {isWorking ? "Approving..." : "Approve"}
            </button>
          </div>
        </Modal>
      ) : null}

      {rejectionTarget ? (
        <Modal title="Reject vendor application" onClose={() => setRejectionTarget(null)}>
          <label className="rejection-field">
            <span>Reason for rejection</span>
            <textarea
              placeholder="Incomplete profile, verification failed, missing store information..."
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
            />
          </label>
          <div className="modal-actions">
            <button className="text-button" type="button" onClick={() => setRejectionTarget(null)}>
              Cancel
            </button>
            <button className="hero-action" disabled={isWorking} type="button" onClick={handleReject}>
              {isWorking ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </Modal>
      ) : null}

      {profileVendor ? (
        <ProfileModal vendor={profileVendor} onClose={() => setProfileVendor(null)} />
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  return (
    <article className={`dashboard-card dashboard-card--${tone}`}>
      <div className="dashboard-card__top">
        <span>{label}</span>
        <strong>Live</strong>
      </div>
      <h2>{value}</h2>
      <p>Vendor onboarding workflow</p>
    </article>
  );
}

function VendorRequestCard({ vendor, onApprove, onProfile, onReject }) {
  const isPending = vendor.approvalStatus === "pending";

  return (
    <article className="vendor-request-card">
      <div className="vendor-request-card__top">
        <div className="vendor-avatar">
          {vendor.avatar ? <img src={vendor.avatar} alt={vendor.name} /> : getInitials(vendor.store?.name || vendor.name)}
        </div>
        <div>
          <h2>{vendor.store?.name || vendor.name}</h2>
          <p>{vendor.email}</p>
        </div>
        <span className={`status-badge status-badge--${vendor.approvalStatus}`}>
          {vendor.approvalStatus}
        </span>
      </div>

      <dl className="vendor-detail-list">
        <div><dt>Vendor Name</dt><dd>{vendor.name}</dd></div>
        <div><dt>Phone Number</dt><dd>{vendor.phone || "Pending vendor update"}</dd></div>
        <div><dt>Store Name</dt><dd>{vendor.store?.name || "Pending vendor update"}</dd></div>
        <div><dt>Store Category</dt><dd>{vendor.store?.category || "Pending vendor update"}</dd></div>
        <div><dt>Location</dt><dd>{vendor.location || "Pending vendor update"}</dd></div>
        <div><dt>Joined Date</dt><dd>{formatDate(vendor.joinedDate)}</dd></div>
        <div><dt>Products count</dt><dd>{vendor.analytics?.products || 0}</dd></div>
      </dl>

      <div className="vendor-card-actions">
        <button className="text-button" type="button" onClick={onProfile}>
          View Full Profile
        </button>
        <button className="hero-action" disabled={!isPending} type="button" onClick={onApprove}>
          Approve
        </button>
        <button className="vendor-danger-button" disabled={!isPending} type="button" onClick={onReject}>
          Reject
        </button>
      </div>
    </article>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="vendor-modal-backdrop" role="presentation">
      <section className="vendor-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="panel-header">
          <div>
            <p className="admin-eyebrow">Approval workflow</p>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">
            X
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ProfileModal({ onClose, vendor }) {
  return (
    <Modal title="Vendor full profile" onClose={onClose}>
      <div className="profile-grid">
        <ProfileSection
          title="Personal information"
          items={[
            ["Name", vendor.name],
            ["Email", vendor.email],
            ["Phone", vendor.phone || "Pending vendor update"],
            ["Location", vendor.location || "Pending vendor update"],
          ]}
        />
        <ProfileSection
          title="Store details"
          items={[
            ["Store Name", vendor.store?.name || "Pending vendor update"],
            ["Description", vendor.store?.description || "Pending vendor update"],
            ["Category", vendor.store?.category || "Pending vendor update"],
          ]}
        />
        <ProfileSection
          title="Business information"
          items={[
            ["GST", vendor.store?.gst || "Pending vendor update"],
            ["Business ID", vendor.store?.businessId || "Pending vendor update"],
            ["Business Type", vendor.store?.businessType || "Pending vendor update"],
            ["Business Address", vendor.store?.businessAddress || "Pending vendor update"],
            ["PAN", vendor.store?.panNumber || "Pending vendor update"],
            ["Documents", vendor.store?.documents?.length ? vendor.store.documents.map((document) => String(document).split(":")[0]).join(", ") : "Pending vendor update"],
          ]}
        />
        <ProfileSection
          title="Analytics"
          items={[
            ["Products", vendor.analytics?.products || 0],
            ["Orders", vendor.analytics?.orders || 0],
            ["Revenue", formatCurrency(vendor.analytics?.revenue)],
            ["Reviews", vendor.analytics?.reviews || 0],
          ]}
        />
        <ProfileSection
          title="Timeline"
          items={[
            ["Account created", formatDate(vendor.timeline?.accountCreated)],
            ["Store created", formatDate(vendor.timeline?.storeCreated)],
            ["Products uploaded", vendor.timeline?.productsUploaded || 0],
          ]}
        />
      </div>
    </Modal>
  );
}

function ProfileSection({ items, title }) {
  return (
    <article className="profile-section">
      <h3>{title}</h3>
      <dl className="vendor-detail-list">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default VendorApprovalCenter;
