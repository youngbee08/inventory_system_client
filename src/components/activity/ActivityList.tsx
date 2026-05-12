import type { Activity } from "../../lib/interfaces";
import {
  formatISODateToCustom,
} from "../../utility/formatterUtilities";
import EmptyState from "../common/EmptyState";

interface ActivityListProps {
  activities: Activity[];
  isLoading?: boolean;
}

const skeletonItems = Array.from({ length: 4 }, (_, index) => index);


const ActivityList = ({ activities, isLoading = false }: ActivityListProps) => {
  if (isLoading) {
    return (
      <div className="min-w-0 max-w-full space-y-4">
        {skeletonItems.map((item) => (
          <div key={item} className="flex gap-3">
            <div className="size-9 animate-pulse rounded-full bg-outlineBlack/70" />
            <div className="min-w-0 flex-1 space-y-2">
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
      />
    );
  }

  return (
    <div className="min-w-0 max-w-full flex flex-col gap-1">
      {activities.map((activity) => (
        <article
          key={activity._id}
          className="flex min-w-0 gap-3 rounded-md border border-transparent border-b-tableBorder px-2 py-1 transition hover:border-tableBorder hover:bg-secondary last:border-b-transparent"
        >
          <div className="min-w-0 flex justify-between w-full">
            <div className="flex  flex-col gap-0">
              <p className="min-w-0 text-[10px] font-semibold leading-5 text-tableHeading [overflow-wrap:anywhere]">
                {activity.message}
              </p>
              <p className="min-w-0 text-[10px] font-semibold leading-5 text-tableHeading [overflow-wrap:anywhere]">
                Performed by : {activity.performedBy?.name}
              </p>
            </div>
            <p className="mt-1 text-end text-[11px] font-medium text-tableData [overflow-wrap:anywhere]">
              {formatISODateToCustom(activity.createdAt)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ActivityList;
