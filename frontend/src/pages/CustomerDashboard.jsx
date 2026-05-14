import { useNavigate } from "react-router-dom";

function CustomerDashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (
    <div>

      <h1>Customer Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default CustomerDashboard;