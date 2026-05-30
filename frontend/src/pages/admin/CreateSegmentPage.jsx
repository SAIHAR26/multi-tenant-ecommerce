import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createSegment,
  deleteSegment,
  getSegmentById,
  getSegments,
} from "../../services/segmentService";

const segmentTypes = [
  "VIP Customers",
  "Repeat Buyers",
  "High Spenders",
  "Inactive Users",
  "Frequent Shoppers",
  "Recent Buyers",
  "Custom Segment",
];

const conditionFields = [
  { value: "totalOrders", label: "Total Orders", operators: [">", "<"], placeholder: "10" },
  { value: "completedOrders", label: "Completed Orders", operators: [">", "<"], placeholder: "3" },
  { value: "spentAmount", label: "Spent Amount", operators: [">", "<"], placeholder: "50000" },
  { value: "lastPurchaseDays", label: "Last Purchase", operators: [">", "<"], placeholder: "30 days" },
  { value: "lastPurchaseDate", label: "Last Purchase Date", operators: ["before", "after"], placeholder: "" },
  { value: "reviewCount", label: "Reviews", operators: [">", "<"], placeholder: "3" },
  { value: "ordersPerMonth", label: "Orders per month", operators: [">", "<"], placeholder: "3" },
  { value: "joinedBefore", label: "Joined before date", operators: ["before"], placeholder: "" },
  { value: "purchasedCategory", label: "Purchased category", operators: ["contains"], placeholder: "Fashion" },
  { value: "location", label: "Location", operators: ["contains"], placeholder: "Mumbai" },
  { value: "age", label: "Age", operators: [">", "<"], placeholder: "25" },
];

const emptyCondition = {
  connector: "AND",
  field: "totalOrders",
  operator: ">",
  value: "",
};

const initialForm = {
  name: "",
  description: "",
  segmentType: "VIP Customers",
  conditions: [{ ...emptyCondition }],
};

const getFieldMeta = (field) => conditionFields.find((item) => item.value === field) || conditionFields[0];

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value);

function CreateSegmentPage() {
  const navigate = useNavigate();
  const { segmentId } = useParams();
  const [segments, setSegments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [customerPercentage, setCustomerPercentage] = useState(3.3);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getSegmentCount = (type) =>
    segments.find((segment) => segment.segmentType === type || segment.name === type)?.customerCount || 0;

  const loadSegments = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await getSegments();
      setSegments(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    getSegments()
      .then((data) => {
        if (isActive) {
          setSegments(data);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        if (isActive) {
          setErrorMessage(error.message);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    Promise.resolve().then(async () => {
      if (!isActive) return;

      if (!segmentId) {
        setSelectedSegment(null);
        setMatchingUsers([]);
        return;
      }

      setDetailsLoading(true);
      setErrorMessage("");
      try {
        const data = await getSegmentById(segmentId);
        if (!isActive) return;
        setSelectedSegment(data.segment);
        setMatchingUsers(data.matchingUsers || []);
        setCustomerPercentage(data.customerPercentage || 0);
      } catch (error) {
        if (isActive) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isActive) {
          setDetailsLoading(false);
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, [segmentId]);

  const updateCondition = (index, key, value) => {
    setForm((currentForm) => {
      const conditions = currentForm.conditions.map((condition, conditionIndex) => {
        if (conditionIndex !== index) return condition;

        if (key === "field") {
          const meta = getFieldMeta(value);
          return {
            ...condition,
            field: value,
            operator: meta.operators[0],
            value: "",
          };
        }

        return { ...condition, [key]: value };
      });

      return { ...currentForm, conditions };
    });
  };

  const addCondition = () => {
    setForm((currentForm) => ({
      ...currentForm,
      conditions: [...currentForm.conditions, { ...emptyCondition }],
    }));
  };

  const removeCondition = (index) => {
    setForm((currentForm) => ({
      ...currentForm,
      conditions: currentForm.conditions.filter((_, conditionIndex) => conditionIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await createSegment({
        ...form,
        conditions: form.conditions.filter((condition) => String(condition.value).trim() !== ""),
      });
      setStatusMessage(response.message || "Segment created successfully");
      setForm(initialForm);
      await loadSegments();
      navigate(`/admin/customer-segments/${response.segment._id}`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = (segment) => {
    setForm({
      name: `${segment.name} Copy`,
      description: segment.description,
      segmentType: segment.segmentType,
      conditions: segment.conditions.length ? segment.conditions : [{ ...emptyCondition }],
    });
    setStatusMessage("Segment copied into the builder.");
  };

  const handleExport = (segment) => {
    const exportPayload = JSON.stringify(segment, null, 2);
    const blob = new Blob([exportPayload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${segment.name.replace(/\s+/g, "-").toLowerCase()}-segment.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    setErrorMessage("");
    setStatusMessage("");
    try {
      await deleteSegment(id);
      setStatusMessage("Segment deleted successfully.");
      if (segmentId === id) {
        navigate("/admin/customer-segments");
      }
      await loadSegments();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Customer segmentation</p>
          <h1>Customer Segmentation Command Center</h1>
          <p>Create and manage smart customer groups using shopping behavior and activity.</p>
        </div>
        <button className="hero-action" type="button" onClick={() => navigate("/admin/customers")}>
          Back to Customers
        </button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple">
          <div className="dashboard-card__top"><span>Total Segments</span><strong>Live</strong></div>
          <h2>{formatNumber(segments.length)}</h2>
          <p>Reusable customer groups</p>
        </article>
        <article className="dashboard-card dashboard-card--cyan">
          <div className="dashboard-card__top"><span>VIP Customers</span><strong>High</strong></div>
          <h2>{formatNumber(getSegmentCount("VIP Customers"))}</h2>
          <p>Premium value segment</p>
        </article>
        <article className="dashboard-card dashboard-card--blue">
          <div className="dashboard-card__top"><span>Inactive Users</span><strong>Watch</strong></div>
          <h2>{formatNumber(getSegmentCount("Inactive Users"))}</h2>
          <p>Need reactivation campaigns</p>
        </article>
        <article className="dashboard-card dashboard-card--violet">
          <div className="dashboard-card__top"><span>Repeat Buyers</span><strong>Live</strong></div>
          <h2>{formatNumber(getSegmentCount("Repeat Buyers"))}</h2>
          <p>Purchased more than once</p>
        </article>
      </section>

      {(statusMessage || errorMessage) && (
        <p className={`admin-action-status ${errorMessage ? "admin-action-status--error" : "admin-action-status--success"}`}>
          {errorMessage || statusMessage}
        </p>
      )}

      <section className="segment-command-grid">
        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Builder</p>
              <h2>Create Segment</h2>
            </div>
            <span className="panel-pill">MongoDB rules</span>
          </div>

          <form className="segment-form" onSubmit={handleSubmit}>
            <label>
              <span>Segment Name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Premium repeat buyers"
              />
            </label>
            <label>
              <span>Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Customers with strong purchase frequency and premium order value."
              />
            </label>
            <label>
              <span>Segment Type</span>
              <select
                value={form.segmentType}
                onChange={(event) => setForm({ ...form, segmentType: event.target.value })}
              >
                {segmentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <div className="segment-condition-stack">
              {form.conditions.map((condition, index) => {
                const meta = getFieldMeta(condition.field);
                return (
                  <div className="segment-condition" key={`${condition.field}-${index}`}>
                    <div className="segment-condition__top">
                      <strong>Condition {index + 1}</strong>
                      {index > 0 && (
                        <select
                          value={condition.connector}
                          onChange={(event) => updateCondition(index, "connector", event.target.value)}
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      )}
                    </div>
                    <div className="segment-condition__grid">
                      <select value={condition.field} onChange={(event) => updateCondition(index, "field", event.target.value)}>
                        {conditionFields.map((field) => (
                          <option key={field.value} value={field.value}>{field.label}</option>
                        ))}
                      </select>
                      <select value={condition.operator} onChange={(event) => updateCondition(index, "operator", event.target.value)}>
                        {meta.operators.map((operator) => (
                          <option key={operator} value={operator}>{operator}</option>
                        ))}
                      </select>
                      <input
                        type={["joinedBefore", "lastPurchaseDate"].includes(condition.field) ? "date" : "text"}
                        value={condition.value}
                        onChange={(event) => updateCondition(index, "value", event.target.value)}
                        placeholder={meta.placeholder}
                      />
                      <button
                        className="text-button"
                        type="button"
                        disabled={form.conditions.length === 1}
                        onClick={() => removeCondition(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="segment-actions">
              <button className="text-button" type="button" onClick={addCondition}>Add Condition</button>
              <button className="hero-action" type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Segment"}
              </button>
            </div>
          </form>
        </article>

        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Live logic</p>
              <h2>Segment rules</h2>
            </div>
            <span className="panel-pill panel-pill--blue">
              {form.conditions.filter((condition) => String(condition.value).trim() !== "").length} active
            </span>
          </div>

          <div className="segment-preview-list">
            {form.conditions.map((condition, index) => (
              <div className="segment-preview-card" key={`${condition.field}-${index}`}>
                <div>
                  <h3>{getFieldMeta(condition.field).label}</h3>
                  <p>{index > 0 ? `${condition.connector} ` : ""}{condition.operator} {condition.value || "value required"}</p>
                </div>
                <strong>{condition.value ? "Active" : "Draft"}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="segment-command-grid">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Segments</p>
              <h2>Saved customer groups</h2>
            </div>
          </div>

          {loading ? (
            <div className="notification-state">Loading segments...</div>
          ) : segments.length === 0 ? (
            <div className="notification-state">No customer segments created yet.</div>
          ) : (
            <div className="segment-list">
              {segments.map((segment) => (
                <button
                  className="segment-list-card"
                  key={segment._id}
                  type="button"
                  onClick={() => navigate(`/admin/customer-segments/${segment._id}`)}
                >
                  <div>
                    <h3>{segment.name}</h3>
                    <p>{segment.segmentType} · {segment.conditions.length} filters</p>
                  </div>
                  <strong>{formatNumber(segment.customerCount)} customers</strong>
                </button>
              ))}
            </div>
          )}
        </article>

        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Details</p>
              <h2>Segment Details</h2>
            </div>
          </div>

          {detailsLoading ? (
            <div className="notification-state">Loading segments...</div>
          ) : selectedSegment ? (
            <div className="segment-details">
              <h3>{selectedSegment.name}</h3>
              <p>{selectedSegment.description || "No description added."}</p>
              <div className="segment-chart" style={{ "--segment-percent": `${Math.min(customerPercentage, 100)}%` }}>
                <span>{customerPercentage}%</span>
              </div>
              <dl className="vendor-detail-list">
                <div><dt>Type</dt><dd>{selectedSegment.segmentType}</dd></div>
                <div><dt>Customers</dt><dd>{formatNumber(selectedSegment.customerCount)}</dd></div>
                <div><dt>Created</dt><dd>{selectedSegment.createdAt ? new Date(selectedSegment.createdAt).toLocaleDateString() : "System segment"}</dd></div>
                <div><dt>Filters</dt><dd>{selectedSegment.conditions.length}</dd></div>
              </dl>
              <div className="segment-filter-list">
                {selectedSegment.conditions.map((condition, index) => (
                  <span key={`${condition.field}-${index}`}>
                    {index > 0 ? `${condition.connector} ` : ""}
                    {getFieldMeta(condition.field).label} {condition.operator} {condition.value}
                  </span>
                ))}
              </div>
              <div className="segment-preview-list">
                {(matchingUsers.length ? matchingUsers : []).slice(0, 4).map((customer) => (
                  <div className="segment-preview-card" key={customer.id || customer.name}>
                    <div><h3>{customer.name}</h3><p>Matching user</p></div>
                    <strong>{customer.orders} orders</strong>
                    <span>{customer.spent}</span>
                    <span className={`status-badge status-badge--${String(customer.status).toLowerCase()}`}>{customer.status}</span>
                  </div>
                ))}
              </div>
              <div className="segment-actions segment-actions--details">
                <button className="text-button" type="button" onClick={() => handleDuplicate(selectedSegment)}>Duplicate Segment</button>
                <button className="text-button" type="button" onClick={() => handleExport(selectedSegment)}>Export Segment</button>
                {String(selectedSegment._id || "").startsWith("system-") ? null : (
                  <button className="vendor-danger-button" type="button" onClick={() => handleDelete(selectedSegment._id)}>Delete Segment</button>
                )}
              </div>
            </div>
          ) : (
            <div className="notification-state">Select a segment to inspect matching users.</div>
          )}
        </article>
      </section>
    </div>
  );
}

export default CreateSegmentPage;
