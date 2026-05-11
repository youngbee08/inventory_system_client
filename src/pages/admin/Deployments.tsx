import type React from "react";
import { MdAdd, MdCheckCircle } from "react-icons/md";
import { PiClock, PiTruck, PiXCircle } from "react-icons/pi";
import type { IconType } from "react-icons";
import ReusableTable from "../../utility/ReuseableTable";
import type { TableColumnProps } from "../../lib/interfaces";
import {
  formatISODateToCustom,
  formatUnderScores,
} from "../../utility/formatterUtilities";

export type DeploymentStatus =
  | "pending"
  | "in_transit"
  | "completed"
  | "cancelled";

export interface Deployment {
  id: string;
  title: string;
  assignedEmployee: string;
  destination: string;
  status: DeploymentStatus;
  createdAt: string;
}

interface DeploymentsProps {
  isRecent?: boolean;
}

const deployments: Deployment[] = [
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
  {
    id: "dep-005",
    title: "Distribution Board Upgrade",
    assignedEmployee: "Ibrahim Musa",
    destination: "Surulere Network Hub",
    status: "completed",
    createdAt: "2026-05-07T11:35:00.000Z",
  },
  {
    id: "dep-006",
    title: "Service Wire Replenishment",
    assignedEmployee: "Ngozi Eze",
    destination: "Apapa Field Store",
    status: "pending",
    createdAt: "2026-05-06T13:10:00.000Z",
  },
];

const statusClasses: Record<DeploymentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  in_transit: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

const statusIcons: Record<DeploymentStatus, IconType> = {
  pending: PiClock,
  in_transit: PiTruck,
  completed: MdCheckCircle,
  cancelled: PiXCircle,
};

const columns: TableColumnProps<Deployment>[] = [
  {
    label: "Deployment Title",
    key: "title",
    className: "px-4 py-4 text-xs font-bold text-tableHeading whitespace-nowrap",
  },
  {
    label: "Assigned Employee",
    key: "assignedEmployee",
  },
  {
    label: "Destination",
    key: "destination",
  },
  {
    label: "Status",
    key: "status",
    render: (deployment) => {
      const StatusIcon = statusIcons[deployment.status];

      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClasses[deployment.status]}`}
        >
          <StatusIcon size={12} />
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
];

const Deployments: React.FC<DeploymentsProps> = ({ isRecent = false }) => {
  const displayedDeployments = isRecent ? deployments.slice(0, 4) : deployments;

  return (
    <section className="flex flex-col gap-5">
      {!isRecent && (
        <div className="flex flex-col gap-4 rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5 sm:flex-row sm:items-center sm:justify-between">
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
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90"
          >
            <MdAdd size={17} />
            Add Deployment
          </button>
        </div>
      )}

      <div className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
        <ReusableTable
          columns={columns}
          data={displayedDeployments}
          isLoading={false}
          error={null}
          currentPage={1}
          totalPages={1}
          totalItems={displayedDeployments.length}
          itemsPerPage={isRecent ? 4 : 10}
          setCurrentPage={() => undefined}
          setItemsPerPage={() => undefined}
          hasSerialNo={false}
        />
      </div>
    </section>
  );
};

export default Deployments;
