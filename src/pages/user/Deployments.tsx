import { useCallback, useEffect, useMemo, useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import ActionCell from "../../components/common/ActionCell";
import api, { getErrorMessage } from "../../helpers/api";
import type {
  Deployment,
  DeploymentStatus,
  TableColumnProps,
} from "../../lib/interfaces";
import ReusableTable from "../../utility/ReuseableTable";
import {
  formatISODateToCustom,
  formatUnderScores,
} from "../../utility/formatterUtilities";

const statusClasses: Record<DeploymentStatus, string> = {
  pending: "bg-amber-50/20 text-amber-700 ring-amber-200",
  in_transit: "bg-blue-50/20 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50/20 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50/20 text-red-700 ring-red-200",
};

const Deployments: React.FC = () => {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeployments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get("/deployments");
      setDeployments((res.data.deployments ?? []).toReversed());
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load deployments"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const columns: TableColumnProps<Deployment>[] = useMemo(
    () => [
      {
        label: "Deployment Title",
        key: "title",
        className:
          "px-4 py-4 text-xs font-bold text-tableHeading whitespace-nowrap",
      },
      {
        label: "Destination",
        key: "destination",
      },
      {
        label: "Materials",
        key: "materials",
        render: (deployment) => deployment.materials.length,
      },
      {
        label: "Status",
        key: "status",
        render: (deployment) => (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClasses[deployment.status]}`}
          >
            {formatUnderScores(deployment.status, true)}
          </span>
        ),
      },
      {
        label: "Created Date",
        key: "createdAt",
        render: (deployment) => formatISODateToCustom(deployment.createdAt),
      },
      {
        label: "Action",
        key: "action",
        render: (deployment) => (
          <ActionCell
            rowId={deployment._id}
            rowItem={deployment}
            onView={() => navigate(`/general/deployments/${deployment._id}`)}
          />
        ),
      },
    ],
    [navigate],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDeployments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchDeployments]);

  return (
    <section className="flex min-w-0 flex-col gap-5 pb-20 lg:pb-0">
      <div>
        <h1 className="text-xl font-extrabold text-tableHeading">
          Assigned Deployments
        </h1>
        <p className="mt-2 text-sm leading-6 text-tableData">
          View deployments assigned to you and inspect their material details.
        </p>
      </div>

      <div className="rounded-md border border-tableBorder bg-white p-4 shadow-sm shadow-primary/5 sm:p-5">
        <ReusableTable
          columns={columns}
          data={deployments}
          isLoading={isLoading}
          error={error}
          currentPage={1}
          totalPages={1}
          totalItems={deployments.length}
          itemsPerPage={10}
          setCurrentPage={() => undefined}
          setItemsPerPage={() => undefined}
          hasSerialNo={false}
          getRowId={(deployment) => deployment._id}
        />
      </div>
    </section>
  );
};

export default Deployments;
