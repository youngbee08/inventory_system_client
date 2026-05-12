import { useCallback, useEffect, useState } from "react";
import type React from "react";
import ActivityList from "../../components/activity/ActivityList";
import type { Activity } from "../../lib/interfaces";
import api, { getErrorMessage } from "../../helpers/api";
import PaginationControls from "../../utility/PaginationControls";

interface ActivitiesProps {
  isRecent?: boolean;
}

const Activities: React.FC<ActivitiesProps> = ({ isRecent = false }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isRecent ? 4 : 10);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get("/activities", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      const pagination = res.data.pagination ?? {};

      setActivities(res.data.activities ?? []);
      setTotalActivities(pagination.totalActivities ?? 0);
      setTotalPages(pagination.totalPages ?? 1);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load activities"));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchActivities();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchActivities]);

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
        {error ? (
          <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        ) : (
          <ActivityList activities={activities} isLoading={isLoading} />
        )}

        {!isRecent && !error && (
          <div className="mt-5">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalActivities}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
              tableType="activities"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Activities;
