import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getDefaultRouteForRole, getStoredUser, isAuthenticated } from "../services/authService";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!isAuthenticated()) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
