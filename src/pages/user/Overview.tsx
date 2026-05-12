import type React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import {
  MdInventory2,
  // MdLocalShipping,
  MdPendingActions,
} from "react-icons/md";
import { PiTruck } from "react-icons/pi";
import ActivityList from "../../components/activity/ActivityList";
import StatCard from "../../components/cards/StatCard";
import SectionHeader from "../../components/common/SectionHeader";
import { useUser } from "../../contexts/user/UserContext";
import { formatCompactAmount } from "../../utility/formatterUtilities";

const StatCardSkeleton = () => (
  <article className="rounded-md border border-tableBorder/60 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <div className="h-4 w-32 animate-pulse rounded bg-outlineBlack/70" />
        <div className="mt-4 h-8 w-20 animate-pulse rounded bg-outlineBlack/70" />
        <div className="mt-3 h-3 w-48 max-w-full animate-pulse rounded bg-outlineBlack/70" />
      </div>
      <div className="size-14 animate-pulse rounded-md bg-outlineBlack/70" />
    </div>
  </article>
);

const Overview: React.FC = () => {
  const { user, dashboardMetrics, loading } = useUser();
  const firstName = user?.name?.split(" ")?.[0] ?? "Employee";

  const metrics = [
    // {
    //   title: "Assigned Deployments",
    //   value: dashboardMetrics.employeeAssignedDeployments,
    //   icon: MdLocalShipping,
    //   subtitle: "Deployments currently assigned to you",
    // },
    {
      title: "Completed Deployments",
      value: dashboardMetrics.employeeCompletedDeployments,
      icon: PiTruck,
      subtitle: "Assignments successfully completed",
    },
    {
      title: "Pending Materials",
      value: dashboardMetrics.employeePendingMaterials,
      icon: MdPendingActions,
      subtitle: "Materials awaiting movement or completion",
    },
    {
      title: "In-Transit Materials",
      value: dashboardMetrics.employeeInTransitMaterials,
      icon: MdInventory2,
      subtitle: "Materials currently in transit",
    },
  ];

  return (
    <main className="flex flex-col gap-6 pb-20 lg:pb-0">
      <section className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-2 text-2xl font-extrabold text-tableHeading">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-tableData">
              Track material movement, and recent
              workspace activity from one focused dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? [0, 1, 2, 3].map((item) => <StatCardSkeleton key={item} />)
          : metrics.map((metric) => (
              <StatCard
                key={metric.title}
                title={metric.title}
                value={formatCompactAmount(metric.value)}
                icon={metric.icon}
                subtitle={metric.subtitle}
              />
            ))}
      </section>

      <section className="min-w-0 rounded-md border border-tableBorder bg-white p-4 shadow-sm shadow-primary/5 sm:p-5">
        <SectionHeader
          title="Recent Activities"
          subtitle="Latest deployment and inventory updates connected to your work."
          action={
            <Link
              to="/general/activities"
              className="flex items-center text-xs font-bold text-primary transition hover:text-primary/80"
            >
              View All <FiArrowUpRight />
            </Link>
          }
        />
        <div className="mt-5">
          <ActivityList
            activities={dashboardMetrics.recentActivities}
            isLoading={loading}
          />
        </div>
      </section>
    </main>
  );
};

export default Overview;
