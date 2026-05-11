import {
  MdInventory2,
  MdLocalShipping,
  MdWarningAmber,
} from "react-icons/md";
import RecentActivityList from "../../components/activity/RecentActivityList";
import StatCard from "../../components/cards/StatCard";
import RecentDeploymentTable from "../../components/tables/RecentDeploymentTable";
import type { RecentDeployment } from "../../components/tables/RecentDeploymentTable";
import { useUser } from "../../contexts/user/UserContext";
import type { Activity } from "../../lib/interfaces";
import {
  formatCompactAmount,
  formatNumberWithCommas,
} from "../../utility/formatterUtilities";

const overviewStats = {
  totalMaterials: 12840,
  lowStockMaterials: 46,
  totalDeployments: 924,
};

const recentDeployments: RecentDeployment[] = [
  {
    id: "dep-001",
    title: "Feeder Panel Replacement",
    assignedEmployee: "Amina Yusuf",
    destination: "Ikeja Business Unit",
    status: "in_transit",
    createdAt: "2026-05-10T09:22:00.000Z",
  },
  {
    id: "dep-002",
    title: "Transformer Accessories Dispatch",
    assignedEmployee: "Daniel Okafor",
    destination: "Lekki Phase 1",
    status: "completed",
    createdAt: "2026-05-09T14:40:00.000Z",
  },
  {
    id: "dep-003",
    title: "Meter Installation Batch",
    assignedEmployee: "Grace Bello",
    destination: "Yaba Service Center",
    status: "pending",
    createdAt: "2026-05-09T08:15:00.000Z",
  },
  {
    id: "dep-004",
    title: "Emergency Cable Supply",
    assignedEmployee: "Tunde Salami",
    destination: "Ajah Field Office",
    status: "cancelled",
    createdAt: "2026-05-08T16:05:00.000Z",
  },
];

const recentActivities: Activity[] = [
  {
    _id: "act-001",
    action: "material_updated",
    message: "Amina Yusuf updated the stock count for armoured cable.",
    performedBy: { _id: 1, name: "Amina Yusuf" },
    material: "Armoured Cable 16mm",
    createdAt: "12 min ago",
  },
  {
    _id: "act-002",
    action: "deployment_completed",
    message: "Daniel Okafor completed a transformer accessories deployment.",
    performedBy: { _id: 2, name: "Daniel Okafor" },
    material: "Transformer Accessories",
    createdAt: "43 min ago",
  },
  {
    _id: "act-003",
    action: "low_stock_alert",
    message: "System flagged porcelain fuse inventory below threshold.",
    performedBy: { _id: 3, name: "System Monitor" },
    material: "Porcelain Fuse 100A",
    createdAt: "1 hr ago",
  },
  {
    _id: "act-004",
    action: "deployment_created",
    message: "Grace Bello created a new meter installation batch.",
    performedBy: { _id: 4, name: "Grace Bello" },
    material: "Single Phase Meter",
    createdAt: "2 hrs ago",
  },
];

const Overview = () => {
  const { user } = useUser();
  const firstName = user?.name?.split(" ")?.[0] ?? "Admin";

  return (
    <main className="flex flex-col gap-6">
      <section className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-2 text-2xl font-extrabold text-tableHeading">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-tableData">
              Monitor material availability, deployment movement, and field
              activity from one operational command view.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Materials"
          value={formatCompactAmount(overviewStats.totalMaterials)}
          icon={MdInventory2}
          subtitle="Across active inventory categories"
        />
        <StatCard
          title="Low Stock Materials"
          value={formatNumberWithCommas(overviewStats.lowStockMaterials)}
          icon={MdWarningAmber}
          subtitle="Items at or below reorder level"
        />
        <StatCard
          title="Total Deployments"
          value={formatCompactAmount(overviewStats.totalDeployments)}
          icon={MdLocalShipping}
          subtitle="All deployment records"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <RecentDeploymentTable deployments={recentDeployments} />
        <RecentActivityList activities={recentActivities} />
      </section>
    </main>
  );
};

export default Overview;
