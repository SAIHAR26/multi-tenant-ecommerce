import { useEffect, useMemo, useState } from "react";
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
  { value: "spentAmount", label: "Spent Amount", operators: [">", "<"], placeholder: "50000" },
  { value: "lastLoginDays", label: "Last Login", operators: [">", "<"], placeholder: "30 days" },
  { value: "ordersPerMonth", label: "Orders per month", operators: [">", "<"], placeholder: "3" },
  { value: "joinedBefore", label: "Joined before date", operators: ["before"], placeholder: "" },
  { value: "purchasedCategory", label: "Purchased category", operators: ["contains"], placeholder: "Fashion" },
  { value: "location", label: "Location", operators: ["contains"], placeholder: "Mumbai" },
  { value: "age", label: "Age", operators: [">", "<"], placeholder: "25" },
];

const previewCustomers = [
  { name: "Anaya Rao", orders: 18, spentAmount: 240000, status: "Live", location: "Mumbai", age: 31, daysSinceLogin: 2, ordersPerMonth: 4.2, joinedAt: "2024-02-12", categories: ["Fashion", "Luxury"] },
  { name: "Rohan Mehta", orders: 11, spentAmount: 98000, status: "Live", location: "Delhi", age: 28, daysSinceLogin: 8, ordersPerMonth: 2.8, joinedAt: "2024-06-18", categories: ["Electronics"] },
  { name: "Maya Sen", orders: 2, spentAmount: 26000, status: "Review", location: "Kolkata", age: 24, daysSinceLogin: 48, ordersPerMonth: 0.8, joinedAt: "2025-01-08", categories: ["Beauty"] },
  { name: "Neil Kapoor", orders: 9, spentAmount: 72000, status: "Live", location: "Bengaluru", age: 35, daysSinceLogin: 14, ordersPerMonth: 2.2, joinedAt: "2023-11-24", categories: ["Home", "Fashion"] },
  { name: "Isha Nair", orders: 21, spentAmount: 310000, status: "Live", location: "Chennai", age: 39, daysSinceLogin: 3, ordersPerMonth: 4.8, joinedAt: "2023-08-02", categories: ["Luxury", "Beauty"] },
  { name: "Dev Shah", orders: 5, spentAmount: 44000, status: "Inactive", location: "Pune", age: 42, daysSinceLogin: 96, ordersPerMonth: 1.1, joinedAt: "2022-12-14", categories: ["Electronics"] },
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

const estimateScale = 2148;

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value);

const evaluatePreviewCondition = (customer, condition) => {
  const numericValue = Number(condition.value || 0);
  const textValue = String(condition.value || "").toLowerCase();

  if (condition.field === "totalOrders") {
    return condition.operator === ">" ? customer.orders > numericValue : customer.orders < numericValue;
  }

  if (condition.field === "spentAmount") {
    return condition.operator === ">" ? customer.spentAmount > numericValue : customer.spentAmount < numericValue;
  }

  if (condition.field === "lastLoginDays") {
    return condition.operator === ">" ? customer.daysSinceLogin > numericValue : customer.daysSinceLogin < numericValue;
  }

  if (condition.field === "ordersPerMonth") {
    return condition.operator === ">" ? customer.ordersPerMonth > numericValue : customer.ordersPerMonth < numericValue;
  }

  if (condition.field === "joinedBefore") {
    return condition.value ? new Date(customer.joinedAt) < new Date(condition.value) : true;
  }

  if (condition.field === "purchasedCategory") {
    return customer.categories.some((category) => category.toLowerCase().includes(textValue));
  }

  if (condition.field === "location") {
    return customer.location.toLowerCase().includes(textValue);
  }

  if (condition.field === "age") {
    return condition.operator === ">" ? customer.age > numericValue : customer.age < numericValue;
  }

  return true;
};

const getPreviewMatches = (conditions) => {
  const activeConditions = conditions.filter((condition) => String(condition.value).trim() !== "");

  if (!activeConditions.length) {
    return previewCustomers.slice(0, 4);
  }

  return previewCustomers.filter((customer) =>
    activeConditions.reduce((result, condition, index) => {
      const passes = evaluatePreviewCondition(customer, condition);
      if (index === 0) return passes;
      return condition.connector === "OR" ? result || passes : result && passes;
    }, true)
  );
};

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

  const previewMatches = useMemo(() => getPreviewMatches(form.conditions), [form.conditions]);
  const estimatedCustomers = Math.max(214, previewMatches.length * estimateScale);

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
          <h2>{segments.length || 14}</h2>
          <p>Reusable customer groups</p>
        </article>
        <article className="dashboard-card dashboard-card--cyan">
          <div className="dashboard-card__top"><span>VIP Customers</span><strong>High</strong></div>
          <h2>2,148</h2>
          <p>Premium value segment</p>
        </article>
        <article className="dashboard-card dashboard-card--blue">
          <div className="dashboard-card__top"><span>Inactive Users</span><strong>Watch</strong></div>
          <h2>534</h2>
          <p>Need reactivation campaigns</p>
        </article>
        <article className="dashboard-card dashboard-card--violet">
          <div className="dashboard-card__top"><span>Repeat Buyers</span><strong>+12.4%</strong></div>
          <h2>18.2K</h2>
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
            <span className="panel-pill">{formatNumber(estimatedCustomers)} customers match</span>
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
                        type={condition.field === "joinedBefore" ? "date" : "text"}
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
              <p className="admin-eyebrow">Live preview</p>
              <h2>Estimated customers</h2>
            </div>
            <span className="panel-pill panel-pill--blue">{formatNumber(estimatedCustomers)}</span>
          </div>

          <div className="segment-preview-list">
            {previewMatches.slice(0, 4).map((customer) => (
              <div className="segment-preview-card" key={customer.name}>
                <div>
                  <h3>{customer.name}</h3>
                  <p>{customer.location} · {customer.categories.join(", ")}</p>
                </div>
                <strong>{customer.orders} orders</strong>
                <span>Rs {formatNumber(customer.spentAmount)}</span>
                <span className={`status-badge status-badge--${customer.status.toLowerCase()}`}>{customer.status}</span>
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
                <div><dt>Created</dt><dd>{new Date(selectedSegment.createdAt).toLocaleDateString()}</dd></div>
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
                <button className="vendor-danger-button" type="button" onClick={() => handleDelete(selectedSegment._id)}>Delete Segment</button>
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
