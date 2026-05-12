import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Overview from "./pages/admin/Overview";
import MainLayout from "./layout/MainLayout";
import Deployments from "./pages/admin/Deployments";
import Materials from "./pages/admin/Materials";
import Reports from "./pages/admin/Reports";
import Login from "./pages/general/auth/Login";
import DashboardOverview from "./pages/user/Overview";
import ProtectRoute from "./helpers/ProtectRoute";
import NotFound from "./pages/general/NotFound";
import Activities from "./pages/general/Activities";
import SingleDeployment from "./pages/admin/SingleDeployment";
import Settings from "./pages/general/Settings";
import Notifications from "./pages/general/Notifications";

const App = () => {
  return (
    <>
      <Toaster closeButton />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
          <Route
            path="/admin/overview"
            element={
              <MainLayout children={<Overview />} pageName="Admin Overview" />
            }
          />

          <Route
            path="/admin/materials"
            element={
              <MainLayout children={<Materials />} pageName="All Materials" />
            }
          />

          <Route
            path="/admin/deployments"
            element={
              <MainLayout children={<Deployments />} pageName="Deployments" />
            }
          />

          <Route
            path="/admin/reports"
            element={
              <MainLayout children={<Reports />} pageName="Inventory Reports" />
            }
          />
        </Route>

        <Route element={<ProtectRoute allowedRoles={["employee"]} />}>
          <Route
            path="/dashboard/overview"
            element={
              <MainLayout
                children={<DashboardOverview />}
                pageName="Employee Dashboard"
              />
            }
          />
        </Route>

        <Route element={<ProtectRoute allowedRoles={["employee", "admin"]} />}>
          <Route
            path="/general/deployments/:id"
            element={
              <MainLayout
                children={<SingleDeployment />}
                pageName="Deployment details"
              />
            }
          />

          <Route
            path="/general/activities"
            element={
              <MainLayout children={<Activities />} pageName="Activity Log" />
            }
          />

          <Route
            path="/dashboard/settings"
            element={<MainLayout children={<Settings />} pageName="Settings" />}
          />

          <Route
            path="/dashboard/notifications"
            element={
              <MainLayout
                children={<Notifications />}
                pageName="Notifications"
              />
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
