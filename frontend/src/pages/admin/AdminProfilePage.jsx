import { useEffect, useState } from "react";
import { getAdminProfile, updateAdminProfile } from "../../services/adminService";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date))
    : "Not available";

function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", location: "", avatar: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let isMounted = true;

    getAdminProfile()
      .then((data) => {
        if (!isMounted) return;
        setProfile(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          location: data.location || "",
          avatar: data.avatar || "",
        });
      })
      .catch((error) => {
        if (isMounted) setStatus({ type: "error", message: error.message });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCancel = () => {
    setForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      avatar: profile?.avatar || "",
    });
    setIsEditing(false);
    setStatus({ type: "", message: "" });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setStatus({ type: "error", message: "Full name is required." });
      return;
    }

    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const updatedProfile = await updateAdminProfile(form);
      setProfile(updatedProfile);
      localStorage.setItem(
        "vshopUser",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("vshopUser") || "{}"),
          name: updatedProfile.name,
          phone: updatedProfile.phone,
          location: updatedProfile.location,
          avatar: updatedProfile.avatar,
        })
      );
      setIsEditing(false);
      setStatus({ type: "success", message: "Profile updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile && !status.message) {
    return <div className="notification-state">Loading admin profile...</div>;
  }

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Admin profile</p>
          <h1>{profile?.name || "Admin Profile"}</h1>
          <p>Manage safe profile fields and review platform ownership details.</p>
        </div>
        <div className="modal-actions">
          {isEditing ? (
            <>
              <button className="text-button" type="button" onClick={handleCancel}>Cancel</button>
              <button className="hero-action" disabled={isSaving} type="button" onClick={handleSave}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button className="hero-action" type="button" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </section>

      {status.message ? <p className={`admin-action-status admin-action-status--${status.type}`}>{status.message}</p> : null}

      <section className="profile-grid">
        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Personal information</p><h2>Profile</h2></div></div>
          <div className="settings-list">
            <ProfileField editable={isEditing} label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <ProfileField label="Email" value={profile?.email || ""} />
            <ProfileField editable={isEditing} label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <ProfileField editable={isEditing} label="Location" name="location" value={form.location} onChange={handleChange} />
            <ProfileField editable={isEditing} label="Profile Picture URL" name="avatar" value={form.avatar} onChange={handleChange} />
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Account information</p><h2>Access</h2></div></div>
          <dl className="vendor-detail-list">
            <div><dt>Role</dt><dd>{profile?.role || "admin"}</dd></div>
            <div><dt>Created</dt><dd>{formatDate(profile?.createdAt)}</dd></div>
            <div><dt>Last Login</dt><dd>{formatDate(profile?.lastLogin)}</dd></div>
          </dl>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">System information</p><h2>Managed records</h2></div></div>
          <dl className="vendor-detail-list">
            <div><dt>Total Vendors Managed</dt><dd>{profile?.system?.totalVendorsManaged || 0}</dd></div>
            <div><dt>Total Customers</dt><dd>{profile?.system?.totalCustomers || 0}</dd></div>
            <div><dt>Total Products</dt><dd>{profile?.system?.totalProducts || 0}</dd></div>
            <div><dt>Total Orders</dt><dd>{profile?.system?.totalOrders || 0}</dd></div>
          </dl>
        </article>
      </section>
    </div>
  );
}

function ProfileField({ editable = false, label, name, onChange, value }) {
  return (
    <label>
      <span>{label}</span>
      {editable ? <input name={name} value={value} onChange={onChange} /> : <input readOnly value={value || "Not available"} />}
    </label>
  );
}

export default AdminProfilePage;
