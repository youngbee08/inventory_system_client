import type React from "react";
import ActivityList from "../../components/activity/ActivityList";
import type { Activity } from "../../lib/interfaces";

interface ActivitiesProps {
  isRecent?: boolean;
}

const activities: Activity[] = [
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
  {
    _id: "act-005",
    action: "material_created",
    message: "Ngozi Eze added a new service wire material record.",
    performedBy: { _id: 5, name: "Ngozi Eze" },
    material: "Service Wire Roll",
    createdAt: "4 hrs ago",
  },
  {
    _id: "act-006",
    action: "deployment_updated",
    message: "Ibrahim Musa updated destination details for a board upgrade.",
    performedBy: { _id: 6, name: "Ibrahim Musa" },
    material: "Distribution Board",
    createdAt: "6 hrs ago",
  },
];

const Activities: React.FC<ActivitiesProps> = ({ isRecent = false }) => {
  const displayedActivities = isRecent ? activities.slice(0, 4) : activities;

  return (
    <section className="flex min-w-0 flex-col gap-5">
      {!isRecent && (
        <div>
          <h1 className="text-xl font-extrabold text-tableHeading">
            Activity Log
          </h1>
          <p className="mt-2 text-sm leading-6 text-tableData">
            Review inventory updates, deployment events, and system activity
            across the workspace.
          </p>
        </div>
      )}

      <div
        className={
          isRecent
            ? ""
            : "rounded-md border border-tableBorder bg-white p-4 shadow-sm shadow-primary/5 sm:p-5"
        }
      >
        <ActivityList activities={displayedActivities} />
      </div>
    </section>
  );
};

export default Activities;
