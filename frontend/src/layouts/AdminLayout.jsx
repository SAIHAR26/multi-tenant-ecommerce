import { Outlet } from "react-router-dom";
import Navbar from "../pages/admin/Navbar";
import Sidebar from "../pages/admin/Sidebar";
import "../pages/AdminDashboard.css";

function AdminLayout() {
  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="admin-shell">
        <Navbar />

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
