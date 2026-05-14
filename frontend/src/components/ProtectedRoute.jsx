import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  role,
}) => {

  // token read
  const token =
    localStorage.getItem("token");

  // role read
  const userRole =
    localStorage.getItem("role");


  // Token lekapothe
  if (!token) {

    return (
      <Navigate to="/login" />
    );

  }


  // Wrong role ayithe
  if (
    role &&
    role !== userRole
  ) {

    return (
      <Navigate to="/login" />
    );

  }


  return children;
};

export default ProtectedRoute;