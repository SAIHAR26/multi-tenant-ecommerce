import { getSavedUser } from "../../api/auth";

function VendorPendingApprovalPage() {
  const user = getSavedUser();
  const isRejected = user?.approvalStatus === "rejected";

  return (
    <section className="vendor-page">
      <div className="vendor-page-header">
        <p className="vendor-eyebrow">Vendor access review</p>
        <h1>{isRejected ? "Your vendor application needs attention." : "Your account is pending approval."}</h1>
        <p>
          {isRejected
            ? user?.rejectionReason || "Admin rejected this application. Please update your details or contact support."
            : "Admin must approve your vendor account before dashboard management tools are available."}
        </p>
      </div>
    </section>
  );
}

export default VendorPendingApprovalPage;
