import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSavedUser } from "../../api/auth";
import { getUserProfile, updateUserProfile } from "../../services/userService";

function VendorSettingsPage() {
  const savedUser = getSavedUser();
  const [form, setForm] = useState({
    name: savedUser?.name || "",
    storeName: savedUser?.store?.name || "",
    storeCategory: savedUser?.store?.category || "",
    phone: savedUser?.phone || "",
    location: savedUser?.location || "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getUserProfile()
      .then((profile) => {
        if (!isMounted) return;
        setForm({
          name: profile?.name || "",
          storeName: profile?.store?.name || "",
          storeCategory: profile?.store?.category || "",
          phone: profile?.phone || "",
          location: profile?.location || "",
          description: profile?.store?.description || "",
        });
      })
      .catch((err) => toast.error(err.message || "Vendor settings could not be loaded."))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await updateUserProfile({
        name: form.name,
        phone: form.phone,
        location: form.location,
        store: {
          name: form.storeName,
          category: form.storeCategory,
          description: form.description,
        },
      });
      toast.success("Vendor settings saved");
    } catch (err) {
      toast.error(err.message || "Vendor settings could not be saved.");
    } finally {
      setSaving(false);
    }
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

      <form className="vendor-form" onSubmit={handleSubmit}>
        <label className="vendor-field"><span>Vendor Name</span><input type="text" value={form.name} onChange={(event) => updateField("name", event.target.value)} disabled={loading} /></label>
        <label className="vendor-field"><span>Store Display Name</span><input type="text" value={form.storeName} onChange={(event) => updateField("storeName", event.target.value)} disabled={loading} /></label>
        <label className="vendor-field"><span>Store Category</span><input type="text" value={form.storeCategory} onChange={(event) => updateField("storeCategory", event.target.value)} disabled={loading} /></label>
        <label className="vendor-field"><span>Contact Email</span><input type="email" value={savedUser?.email || ""} disabled /></label>
        <label className="vendor-field"><span>Phone Number</span><input type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} disabled={loading} /></label>
        <label className="vendor-field"><span>Location</span><input type="text" value={form.location} onChange={(event) => updateField("location", event.target.value)} disabled={loading} /></label>
        <label className="vendor-field vendor-field-wide"><span>Store Customization</span><textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} disabled={loading} /></label>
        <div className="vendor-form-actions">
          <button type="button" disabled>{loading ? "Loading store" : "Preview Store"}</button>
          <button type="submit" disabled={loading || saving}>{saving ? "Saving..." : "Save Settings"}</button>
        </div>
      </form>
    </>
  );
}

export default VendorSettingsPage;
