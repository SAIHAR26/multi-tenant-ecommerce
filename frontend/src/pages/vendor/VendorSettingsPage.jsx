import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getVendorStore, updateVendorStore } from "../../services/vendorService";

function VendorSettingsPage() {
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState("");
  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    storeCategory: "",
    location: "",
    storeLogo: "",
    storeBanner: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVendorStore()
      .then((data) => {
        if (!isMounted) return;
        const store = data?.store || {};
        setStoreId(store._id || "");
        setForm({
          storeName: store.storeName || "",
          storeDescription: store.storeDescription || "",
          storeCategory: store.storeCategory || "",
          location: store.location || "",
          storeLogo: store.storeLogo || "",
          storeBanner: store.storeBanner || "",
        });
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Store settings could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await updateVendorStore(form);
      setStoreId(data?.store?._id || storeId);
      setMessage("Settings saved.");
    } catch (err) {
      setError(err.message || "Settings could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Store controls</p>
          <h1>Settings</h1>
          <span>Update vendor profile, storefront details, security, and contact channels.</span>
        </div>
      </section>

      {loading ? <LoadingState message="Loading store settings..." /> : null}
      {!loading && error ? <ErrorState title="Settings issue" message={error} /> : null}

      {!loading ? (
        <form className="vendor-form" onSubmit={handleSubmit}>
          {message ? <p className="vendor-form-success">{message}</p> : null}
          <label className="vendor-field"><span>Store ID</span><input readOnly value={storeId} /></label>
          <label className="vendor-field"><span>Store Display Name</span><input required value={form.storeName} onChange={(event) => updateField("storeName", event.target.value)} /></label>
          <label className="vendor-field"><span>Store Category</span><input required value={form.storeCategory} onChange={(event) => updateField("storeCategory", event.target.value)} /></label>
          <label className="vendor-field"><span>Location</span><input value={form.location} onChange={(event) => updateField("location", event.target.value)} /></label>
          <label className="vendor-field vendor-field-wide"><span>Store Description</span><textarea value={form.storeDescription} onChange={(event) => updateField("storeDescription", event.target.value)} /></label>
          <label className="vendor-field"><span>Store Logo URL</span><input value={form.storeLogo} onChange={(event) => updateField("storeLogo", event.target.value)} /></label>
          <label className="vendor-field"><span>Store Banner URL</span><input value={form.storeBanner} onChange={(event) => updateField("storeBanner", event.target.value)} /></label>
          <div className="vendor-form-actions">
            <button type="button" onClick={handleLogout}>Logout</button>
            <button type="button" onClick={() => navigate("/vendor/store-profile")}>Preview Store</button>
            <button disabled={saving} type="submit">{saving ? "Saving..." : "Save Settings"}</button>
          </div>
        </form>
      ) : null}
    </>
  );
}

export default VendorSettingsPage;
