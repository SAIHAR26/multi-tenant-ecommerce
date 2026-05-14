import { Outlet } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";
import VendorSidebar from "../components/VendorSidebar";
import "../pages/VendorDashboard.css";

function VendorLayout() {
  return (
    <div className="vendor-dashboard">
      {/* Shared vendor shell keeps sidebar and navbar persistent across nested pages. */}
      <VendorSidebar />

      <div className="vendor-shell">
        <VendorNavbar />

        <main className="vendor-main">
          {/* Nested vendor routes render here with the existing dashboard styling. */}
          <div className="vendor-page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;
