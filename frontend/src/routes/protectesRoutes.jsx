import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  role
}) => {

  const token =
    localStorage.getItem("vshopToken");

  const user =
    JSON.parse(
      localStorage.getItem("vshopUser")
    );

  // login lekapothe
  if (!token) {
    return <Navigate to="/login" />;
  }

  // wrong role
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;