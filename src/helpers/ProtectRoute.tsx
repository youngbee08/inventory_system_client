import React from "react";
import { useUser } from "../contexts/user/UserContext";
import { Outlet } from "react-router-dom";
import DashboardLoading from "../components/ui/DashboardLoading";

interface ProtectRouteProps {
  allowedRoles?: string[];
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useUser();

  if (loading) {
    return <DashboardLoading />;
  }

  if (!isAuthenticated) {
    window.location.replace("/");
    return null;
  }

  if (user && !allowedRoles?.includes(user?.role)) {
    window.location.replace("/");
    return null;
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectRoute;
