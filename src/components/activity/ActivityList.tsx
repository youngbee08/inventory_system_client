import { PiPulse } from "react-icons/pi";
import type { Activity } from "../../lib/interfaces";
import {
  formatUnderScores,
  getInitials,
} from "../../utility/formatterUtilities";
import EmptyState from "../common/EmptyState";

interface ActivityListProps {
  activities: Activity[];
  isLoading?: boolean;
}

const skeletonItems = Array.from({ length: 4 }, (_, index) => index);

const getPerformerInitials = (name: string) => {
  const [firstName = "System", lastName = "User"] = name.trim().split(" ");
  return getInitials(firstName, lastName);
};

const ActivityList = ({ activities, isLoading = false }: ActivityListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {skeletonItems.map((item) => (
          <div key={item} className="flex gap-3">
            <div className="size-9 animate-pulse rounded-full bg-outlineBlack/70" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-11/12 animate-pulse rounded bg-outlineBlack/70" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-outlineBlack/70" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <EmptyState
        title="No recent activity"
        message="Inventory and deployment events will appear in this feed."
        icon={PiPulse}
      />
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <article
          key={activity._id}
          className="flex gap-3 border-b border-tableBorder pb-4 last:border-b-0 last:pb-0"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-extrabold text-primary">
            {getPerformerInitials(activity.performedBy.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold leading-5 text-tableHeading">
                {activity.message}
              </p>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-tableData ring-1 ring-tableBorder">
                {formatUnderScores(activity.action, true)}
              </span>
            </div>
            <p className="mt-1 text-[11px] font-medium text-tableData">
              {activity.material} - {activity.createdAt}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ActivityList;
