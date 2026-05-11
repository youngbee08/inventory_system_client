import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api, { getErrorMessage, setupInterceptors } from "../../helpers/api";
import axios from "axios";
import type {
  DashboardMetrics,
  UserProps,
} from "../../lib/interfaces";
import { UserContext } from "./UserContext";

interface userProviderProps {
  children: React.ReactNode;
}

const EMPTY_METRICS: DashboardMetrics = {
  employeeAssignedDeployments: 0,
  employeeCompletedDeployments: 0,
  employeePendingMaterials: 0,
  employeeInTransitMaterials: 0,
  totalMaterials: 0,
  lowStockMaterials: 0,
  totalDeployments: 0,
  recentActivities: [],
};


export const UserProvider = ({ children }: userProviderProps) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [dashboardMetrics, setDashboardMetrics] = useState<
    DashboardMetrics 
  >(EMPTY_METRICS);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("dashboardMetrics");
    setToken(null);
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    setDashboardMetrics(EMPTY_METRICS);
    toast.success("Logged out successfully");
    window.location.href = "/";
  }, []);

  const refreshUser = useCallback(
    async (token: string) => {
      if (!token) throw new Error("No token");

      try {
        const response = await api.get("/auth/refresh-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { user } = response.data;

        setUser(user);
        setRole(user?.role);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user?.role);
      } catch (err: unknown) {
        console.error("Failed to refresh user:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          logout();
        }
        throw err;
      }
    },
    [logout],
  );

  const fetchDashboardMetrics = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/overview");
      setDashboardMetrics(res.data.data);
    } catch (error: unknown) {
      const errMsg = getErrorMessage(error, "Failed to load metrics");
      toast.error(errMsg);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);

        await refreshUser(storedToken);
        await fetchDashboardMetrics();

        setIsAuthenticated(true);
      } catch (error: unknown) {
        console.warn("Invalid or expired session. Clearing...");
        console.error("Session error details:", error);
        logout();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshUser, logout, fetchDashboardMetrics]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    setIsAuthenticated(true);
    refreshUser(token);
    fetchDashboardMetrics();
  };

  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        role: role,
        login,
        logout,
        isAuthenticated,
        refreshUser,
        dashboardMetrics,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
