import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  role,
}) => {

  const token =
    localStorage.getItem("vshopToken");

  const user = JSON.parse(
    localStorage.getItem("vshopUser")
  );

  // No login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Wrong role
  if (
    role &&
    user?.role !== role
  ) {
    return (
      <Navigate to="/unauthorized" />
    );
  }

  return children;
};

export default ProtectedRoute;