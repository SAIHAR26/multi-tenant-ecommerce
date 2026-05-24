import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; // 1. Import axios
import "./Auth.css";

const categories = [
  "Fashion",
  "Shoes",
  "Electronics",
  "Books",
  "Men Wear",
  "Women Wear",
  "Kids",
  "Accessories",
  "Other",
];

function Register() {
  const [role, setRole] = useState("customer");
  const isCustomer = role === "customer";
  const navigate = useNavigate(); 

  // 2. Track all form inputs in unified state objects
  const [customerData, setCustomerData] = useState({
    name: "", email: "", phone: "", location: "", age: "", password: "", confirmPassword: ""
  });

  const [vendorData, setVendorData] = useState({
    storeName: "", ownerName: "", email: "", phone: "", category: "", location: "", bankDetails: "", password: "", confirmPassword: ""
  });

  // 3. Handle input changes dynamically
  const handleCustomerChange = (e) => setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  const handleVendorChange = (e) => setVendorData({ ...vendorData, [e.target.name]: e.target.value });

  // 4. Submit logic that actually saves data to your database
  const handleSubmit = async (event) => {
    event.preventDefault(); 

    const payload = isCustomer 
      ? { ...customerData, role } 
      : { ...vendorData, role };

    // Simple confirmation check
    if (payload.password !== payload.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // 5. Fire request to your running server
      const response = await axios.post("http://localhost:5000/api/auth/register", payload);
      
      if (response.status === 201 || response.status === 200) {
        alert("Registration Successful!");
        navigate("/login"); // Redirect only after a successful database save
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <main className="auth-page auth-page--register">
      <a className="auth-logo auth-logo--floating" href="/">
        <span>V</span> SHOP
      </a>

      <section className="signup-shell">
        <div className="signup-header">
          <p className="auth-eyebrow">Join the marketplace</p>
          <h1>Create your V SHOP account</h1>
          <p>Choose your role and start with a premium ecommerce experience built for customers and vendors.</p>
        </div>

        <div className="role-grid" aria-label="Choose signup role">
          <button
            className={`role-card ${isCustomer ? "role-card--active" : ""}`}
            type="button"
            onClick={() => setRole("customer")}
          >
            <span>Customer</span>
            <strong>Shop premium collections across trusted stores.</strong>
          </button>

          <button
            className={`role-card ${!isCustomer ? "role-card--active" : ""}`}
            type="button"
            onClick={() => setRole("vendor")}
          >
            <span>Vendor</span>
            <strong>Launch your store and manage products with style.</strong>
          </button>
        </div>

        <form className="auth-card signup-form" onSubmit={handleSubmit}>
          <div className="auth-card__header">
            <p className="auth-eyebrow">{isCustomer ? "Customer signup" : "Vendor signup"}</p>
            <h2>{isCustomer ? "Create customer profile" : "Create vendor store"}</h2>
          </div>

          {isCustomer ? (
            <CustomerFields formData={customerData} handleChange={handleCustomerChange} />
          ) : (
            <VendorFields formData={vendorData} handleChange={handleVendorChange} />
          )}

          <button className="auth-button" type="submit">
            Create Account
          </button>

          <p className="auth-switch">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </section>
    </main>
  );
}

function CustomerFields({ formData, handleChange }) {
  return (
    <div className="auth-grid">
      <label className="auth-field auth-field--wide">
        <span>Full Name</span>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
      </label>

      <label className="auth-field">
        <span>Email</span>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
      </label>

      <label className="auth-field">
        <span>Phone Number</span>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
      </label>

      <label className="auth-field">
        <span>Location</span>
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, State" />
      </label>

      <label className="auth-field">
        <span>Age</span>
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="21" />
      </label>

      <label className="auth-field">
        <span>Password</span>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" required />
      </label>

      <label className="auth-field">
        <span>Confirm Password</span>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
      </label>
    </div>
  );
}

function VendorFields({ formData, handleChange }) {
  return (
    <div className="auth-grid">
      <label className="auth-field">
        <span>Store Name</span>
        <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} placeholder="Your store name" required />
      </label>

      <label className="auth-field">
        <span>Owner Name</span>
        <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Store owner name" required />
      </label>

      <label className="auth-field">
        <span>Email</span>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="vendor@example.com" required />
      </label>

      <label className="auth-field">
        <span>Phone Number</span>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
      </label>

      <label className="auth-field">
        <span>Store Category</span>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="" disabled>Select category</option>
          {categories.map((category) => (
            <option key={category} value={category.toLowerCase()}>{category}</option>
          ))}
        </select>
      </label>

      <label className="auth-field">
        <span>Shop Location</span>
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, State" />
      </label>

      <label className="auth-field auth-field--wide">
        <span>Bank Details</span>
        <input type="text" name="bankDetails" value={formData.bankDetails} onChange={handleChange} placeholder="Account holder, account number, IFSC" />
      </label>

      <label className="auth-field">
        <span>Password</span>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" required />
      </label>

      <label className="auth-field">
        <span>Confirm Password</span>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
      </label>
    </div>
  );
}

export default Register;