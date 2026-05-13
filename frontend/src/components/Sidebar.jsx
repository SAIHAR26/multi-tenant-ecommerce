function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#111827",
      color: "white",
      padding: "20px"
    }}>
      <h2>V SHOP</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>Dashboard</li>
        <li>Users</li>
        <li>Products</li>
        <li>Orders</li>
      </ul>
    </div>
  );
}

export default Sidebar;