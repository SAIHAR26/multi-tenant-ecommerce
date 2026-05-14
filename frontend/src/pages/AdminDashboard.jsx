import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (
    <div>

      <h1>Admin Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default AdminDashboard;