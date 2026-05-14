import DashboardCard from "../components/common/DashboardCard";

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <DashboardCard title="Users" value="120" />
      <DashboardCard title="Products" value="300" />
      <DashboardCard title="Orders" value="45" />
    </div>
  );
}

export default AdminDashboard;