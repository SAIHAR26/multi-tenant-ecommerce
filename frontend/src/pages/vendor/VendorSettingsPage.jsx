function VendorSettingsPage() {
  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Store controls</p>
          <h1>Settings</h1>
          <span>Update vendor profile, storefront details, security, and contact channels.</span>
        </div>
      </section>

      <form className="vendor-form" onSubmit={(event) => event.preventDefault()}>
        <label className="vendor-field"><span>Vendor Name</span><input type="text" placeholder="Crimson Atelier" /></label>
        <label className="vendor-field"><span>Store Display Name</span><input type="text" placeholder="Crimson Atelier" /></label>
        <label className="vendor-field"><span>Contact Email</span><input type="email" placeholder="seller@crimsonatelier.com" /></label>
        <label className="vendor-field"><span>Phone Number</span><input type="tel" placeholder="+91 90000 00000" /></label>
        <label className="vendor-field"><span>New Password</span><input type="password" placeholder="Change password" /></label>
        <label className="vendor-field"><span>Store Accent Copy</span><input type="text" placeholder="Luxury accessories for modern shoppers" /></label>
        <label className="vendor-upload vendor-field-wide">
          <span>Store Logo Upload</span>
          <input type="file" />
          <strong>Upload storefront logo</strong>
          <small>Recommended square image for dashboard and marketplace surfaces.</small>
        </label>
        <label className="vendor-field vendor-field-wide"><span>Store Customization</span><textarea placeholder="Add storefront policies, signature packaging notes, and support timing." /></label>
        <div className="vendor-form-actions">
          <button type="button">Preview Store</button>
          <button type="submit">Save Settings</button>
        </div>
      </form>
    </>
  );
}

export default VendorSettingsPage;
