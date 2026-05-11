import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import {
  formatISODateToCustom,
  formatUnderScores,
} from "../../utility/formatterUtilities";

export type DeploymentStatus =
  | "pending"
  | "in_transit"
  | "completed"
  | "cancelled";

export interface RecentDeployment {
  id: string | number;
  title: string;
  assignedEmployee: string;
  destination: string;
  status: DeploymentStatus;
  createdAt: string;
}

interface RecentDeploymentTableProps {
  deployments: RecentDeployment[];
  isLoading?: boolean;
}

const statusClasses = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  in_transit: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

const skeletonRows = Array.from({ length: 4 }, (_, index) => index);

const RecentDeploymentTable = ({
  deployments,
  isLoading = false,
}: RecentDeploymentTableProps) => {
  return (
    <section className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
      <SectionHeader
        title="Recent Deployments"
        subtitle="Latest material dispatches and employee assignments."
      />

      <div className="mt-5 overflow-x-auto styled-scrollbar">
        <table className="w-full min-w-190">
          <thead>
            <tr className="border-y border-tableBorder bg-secondary">
              {[
                "Deployment Title",
                "Assigned Employee",
                "Destination",
                "Status",
                "Created Date",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-[11px] font-bold uppercase text-tableHeading"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              skeletonRows.map((row) => (
                <tr key={row} className="border-b border-tableBorder">
                  {Array.from({ length: 5 }, (_, index) => (
                    <td key={index} className="px-4 py-4">
                      <div className="h-3 w-full max-w-34 animate-pulse rounded bg-outlineBlack/70" />
                    </td>
                  ))}
                </tr>
              ))
            ) : deployments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-5">
                  <EmptyState
                    title="No deployments yet"
                    message="New deployments will appear here once dispatch records are created."
                  />
                </td>
              </tr>
            ) : (
              deployments.map((deployment) => (
                <tr
                  key={deployment.id}
                  className="border-b border-tableBorder last:border-b-0"
                >
                  <td className="px-4 py-4 text-xs font-bold text-tableHeading">
                    {deployment.title}
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-tableData">
                    {deployment.assignedEmployee}
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-tableData">
                    {deployment.destination}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClasses[deployment.status]}`}
                    >
                      {formatUnderScores(deployment.status, true)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-tableData">
                    {formatISODateToCustom(deployment.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentDeploymentTable;
