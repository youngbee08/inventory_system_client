import { useEffect, useState } from "react";
import type React from "react";
import { MdAdd } from "react-icons/md";
import ReusableTable from "../../utility/ReuseableTable";
import type {
  Deployment,
  DeploymentStatus,
  TableColumnProps,
} from "../../lib/interfaces";
import {
  formatISODateToCustom,
  formatUnderScores,
} from "../../utility/formatterUtilities";
import api, { getErrorMessage } from "../../helpers/api";
import ActionCell from "../../components/common/ActionCell";
import EditDeploymentDialog from "../../components/modals/EditDeploymentDialog";
import { useNavigate } from "react-router-dom";

interface DeploymentsProps {
  isRecent?: boolean;
}

const statusClasses: Record<DeploymentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  in_transit: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

const getAssignedToLabel = (assignedTo: Deployment["assignedTo"]) => {
  if (typeof assignedTo === "string") {
    return assignedTo;
  }
  return assignedTo?.name;
};

const Deployments: React.FC<DeploymentsProps> = ({ isRecent = false }) => {
  const navigate = useNavigate();

  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectdeDeployment, setSelectedDeployment] =
    useState<Deployment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const columns: TableColumnProps<Deployment>[] = [
    {
      label: "Deployment Title",
      key: "title",
      className:
        "px-4 py-4 text-xs font-bold text-tableHeading whitespace-nowrap",
    },
    {
      label: "Assigned Employee",
      key: "assignedTo",
      render: (deployment) =>
        getAssignedToLabel(deployment.assignedTo) || (
          <p className="text-center">-</p>
        ),
    },
    {
      label: "Destination",
      key: "destination",
    },
    {
      label: "Status",
      key: "status",
      render: (deployment) => {
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClasses[deployment.status]}`}
          >
            {formatUnderScores(deployment.status, true)}
          </span>
        );
      },
    },
    {
      label: "Created Date",
      key: "createdAt",
      render: (deployment) => formatISODateToCustom(deployment.createdAt),
    },
    ...(!isRecent
      ? [
          {
            label: "Action",
            key: "action",
            render: (deployment: Deployment) => (
              <ActionCell
                rowId={6}
                rowItem={deployment}
                toggleAction={() => setSelectedDeployment(deployment)}
                onEdit={() => setShowEditModal(true)}
                onView={() => navigate(`${deployment._id}`)}
              />
            ),
          },
        ]
      : []),
  ];

  useEffect(() => {
    const fetchDeployments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await api.get("/deployments");
        setDeployments(res.data.deployments ?? []);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load deployments"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  const displayedDeployments = isRecent ? deployments.slice(0, 4) : deployments;

  return (
    <>
      <section className="flex min-w-0 flex-col gap-5">
        {!isRecent && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-tableHeading">
                Deployments
              </h1>
              <p className="mt-2 text-sm leading-6 text-tableData">
                Track material dispatches, employee assignments, destinations,
                and deployment status.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 sm:w-auto"
            >
              <MdAdd size={17} />
              Add Deployment
            </button>
          </div>
        )}

        <div
          className={
            isRecent
              ? ""
              : "rounded-md border border-tableBorder bg-white p-4 shadow-sm shadow-primary/5 sm:p-5"
          }
        >
          <ReusableTable
            columns={columns}
            data={displayedDeployments}
            isLoading={isLoading}
            error={error}
            currentPage={1}
            totalPages={1}
            totalItems={displayedDeployments.length}
            itemsPerPage={isRecent ? 4 : 10}
            setCurrentPage={() => undefined}
            setItemsPerPage={() => undefined}
            hasSerialNo={false}
            getRowId={(deployment) => deployment._id}
          />
        </div>
      </section>
      <EditDeploymentDialog
        isOpen={showEditModal}
        onCancel={() => setShowEditModal(false)}
        deployment={selectdeDeployment}
      />
    </>
  );
};

export default Deployments;
