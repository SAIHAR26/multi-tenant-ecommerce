import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />

      <main>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;