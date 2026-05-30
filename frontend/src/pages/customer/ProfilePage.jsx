import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { getSavedUser } from "../../api/auth";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", location: "", age: "", avatar: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setForm({
          name: data?.name || "",
          phone: data?.phone || "",
          location: data?.location || "",
          age: data?.age || "",
          avatar: data?.avatar || "",
        });
        setLoading(false);
      } catch (err) {
        const backupUser = getSavedUser();
        if (backupUser) {
          setProfile(backupUser);
          setForm({
            name: backupUser.name || "",
            phone: backupUser.phone || "",
            location: backupUser.location || "",
            age: backupUser.age || "",
            avatar: backupUser.avatar || "",
          });
        } else {
          setError("Failed to fetch user registration identities. " + (err.message || ""));
        }
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    const avatar = await fileToDataUrl(file);
    setForm((currentForm) => ({ ...currentForm, avatar }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const updatedProfile = await updateUserProfile(form);
      setProfile(updatedProfile);
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Profile could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="customer-page"><p className="customer-eyebrow">Syncing secure profile dashboard...</p></div>;
  }

  if (error && !profile) {
    return <div className="customer-page"><p className="customer-eyebrow" style={{ color: "red" }}>{error}</p></div>;
  }

  const customerName = profile?.name || "Customer User";
  const customerEmail = profile?.email || "customer@vshop.com";
  
  const initials = customerName
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Profile</p>
          <h1>Your V SHOP identity.</h1>
          <p>Manage personal details, saved addresses, reward tier, and shopping preferences.</p>
        </div>
        <button className="customer-primary-button" type="button" onClick={() => setEditing((value) => !value)}>
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </section>

      <section className="customer-content-grid">
        <article className="customer-panel">
          {editing ? (
            <form className="checkout-form-grid" onSubmit={handleSave}>
              <Field label="Full Name" name="name" value={form.name} onChange={handleChange} />
              <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <Field label="Location" name="location" value={form.location} onChange={handleChange} />
              <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
              <label className="checkout-field checkout-field--wide">
                <span>Upload Profile Image</span>
                <input accept="image/*" type="file" onChange={handleImageUpload} />
              </label>
              {form.avatar ? <img className="customer-profile-preview" src={form.avatar} alt="Profile preview" /> : null}
              <button className="customer-primary-button" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          ) : (
            <div className="customer-profile-large">
              <span className="customer-profile-large__avatar">
                {profile?.avatar ? <img src={profile.avatar} alt={customerName} /> : initials}
              </span>
              <div>
                <p className="customer-eyebrow">{profile?.tier || "Gold member"}</p>
                <h2>{customerName}</h2>
                <span>{customerEmail}</span>
                <span>{profile?.phone || "Phone not added"}</span>
              </div>
            </div>
          )}
        </article>

        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Saved addresses</p><h2>Delivery locations</h2></div></div>
          <div className="address-card">
            <h3>Home</h3>
            <p>{profile?.location || "No delivery location saved yet."}</p>
            <span>{profile?.location ? "Default location" : "Add your location from Edit Profile"}</span>
          </div>
        </article>
      </section>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="checkout-field">
      <span>{label}</span>
      <input name={name} type={type} value={value} onChange={onChange} />
    </label>
  );
}

export default ProfilePage;
