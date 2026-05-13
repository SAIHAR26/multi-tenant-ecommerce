import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/customer/CustomerNavbar";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import "../pages/customer/CustomerDashboard.css";

function CustomerLayout() {
  return (
    <div className="customer-dashboard">
      <CustomerSidebar />

      <div className="customer-shell">
        <CustomerNavbar />

        <main className="customer-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
