import { useCallback, useEffect, useMemo, useState } from "react";
import type React from "react";
import { MdCheckCircle, MdLocalShipping } from "react-icons/md";
import { PiClock, PiPackage, PiTruck, PiXCircle } from "react-icons/pi";
import StatCard from "../../components/cards/StatCard";
import SectionHeader from "../../components/common/SectionHeader";
import ReusableTable from "../../utility/ReuseableTable";
import type {
  Deployment,
  DeploymentStatus,
  Material,
  TableColumnProps,
} from "../../lib/interfaces";
import api, { getErrorMessage } from "../../helpers/api";
import {
  formatCompactAmount,
  formatISODateToCustom,
  formatNumberWithCommas,
  formatUnderScores,
} from "../../utility/formatterUtilities";

interface DashboardStats {
  totalMaterials: number;
  lowStockMaterials: number;
  totalInventoryQuantity: number;
  totalDeployments: number;
  pendingDeployments: number;
  inTransitDeployments: number;
  completedDeployments: number;
  cancelledDeployments: number;
  totalAllocatedMaterials: number;
  usedMaterialsCount: number;
  recentMaterials: Material[];
  recentDeployments: Deployment[];
}

const emptyStats: DashboardStats = {
  totalMaterials: 0,
  lowStockMaterials: 0,
  totalInventoryQuantity: 0,
  totalDeployments: 0,
  pendingDeployments: 0,
  inTransitDeployments: 0,
  completedDeployments: 0,
  cancelledDeployments: 0,
  totalAllocatedMaterials: 0,
  usedMaterialsCount: 0,
  recentMaterials: [],
  recentDeployments: [],
};

const statusClasses: Record<DeploymentStatus, string> = {
  pending: "bg-amber-50/20 text-amber-700 ring-amber-200",
  in_transit: "bg-blue-50/20 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50/20 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50/20 text-red-700 ring-red-200",
};

const getAssignedToLabel = (assignedTo: Deployment["assignedTo"]) => {
  if (typeof assignedTo === "string") return assignedTo;
  return assignedTo?.name ?? "-";
};

const Reports: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get("/dashboard/stats");
      setStats({
        ...emptyStats,
        ...(res.data.stats ?? res.data.data ?? res.data),
        recentDeployments:
          res.data.recentDeployments ??
          res.data.stats?.recentDeployments ??
          res.data.data?.recentDeployments ??
          [],
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load report stats"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStats();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchStats]);

  const columns: TableColumnProps<Deployment>[] = useMemo(
    () => [
      {
        label: "Deployment Title",
        key: "title",
        className:
          "px-4 py-4 text-xs font-bold text-tableHeading whitespace-nowrap",
      },
      {
        label: "Assigned Employee",
        key: "assignedTo",
        render: (deployment) => getAssignedToLabel(deployment.assignedTo),
      },
      {
        label: "Destination",
        key: "destination",
      },
      {
        label: "Status",
        key: "status",
        render: (deployment) => (
          <span
            className={`rounded-md px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClasses[deployment.status]}`}
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
    ],
    [],
  );

  const materialColumns: TableColumnProps<Material>[] = useMemo(
    () => [
      {
        label: "Material Name",
        key: "name",
        className:
          "px-4 py-4 text-xs font-bold text-tableHeading whitespace-nowrap",
      },

      {
        label: "Quantity",
        key: "quantity",
      },
      {
        label: "Location",
        key: "location",
      },
      {
        label: "Threshold",
        key: "threshold",
      },

      {
        label: "Unit",
        key: "unit",
      },
      // {
      //   label: "Status",
      //   key: "status",
      //   render: (material) => (
      //     <span
      //       className={`rounded-md px-2.5 py-1 text-[10px] font-bold ring-1 ${material.isActive ? "bg-blue-50/20 text-blue-700 ring-blue-200" : "bg-red-50/20 text-red-700 ring-red-200"}`}
      //     >
      //       {material.isActive ? "Active" : "Inactive"}
      //     </span>
      //   ),
      // },
      {
        label: "Created Date",
        key: "createdAt",
        render: (material) => formatISODateToCustom(material.createdAt),
      },
    ],
    [],
  );

  const statusOverview = [
    {
      label: "Pending Deployment",
      value: stats.pendingDeployments,
      icon: PiClock,
      className: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    {
      label: "In Transit Deployment",
      value: stats.inTransitDeployments,
      icon: PiTruck,
      className: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    {
      label: "Completed Deployment",
      value: stats.completedDeployments,
      icon: MdCheckCircle,
      className: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    {
      label: "Cancelled Deployment",
      value: stats.cancelledDeployments,
      icon: PiXCircle,
      className: "bg-blue-50 text-blue-700 ring-blue-200",
    },
  ];

  return (
    <main className="flex min-w-0 flex-col gap-6 lg:pb-0 pb-20">
      <div>
        <h1 className="text-xl font-extrabold text-tableHeading">
          Inventory Reports
        </h1>
        <p className="mt-2 text-sm leading-6 text-tableData">
          Review inventory health, material usage, and deployment performance.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Inventory Qty"
          value={formatCompactAmount(stats.totalInventoryQuantity)}
          icon={PiPackage}
          subtitle="Total units available"
        />
        <StatCard
          title="Allocated Materials"
          value={formatCompactAmount(stats.totalAllocatedMaterials)}
          icon={MdLocalShipping}
          subtitle="All deployment records"
        />
        <StatCard
          title="Used Materials"
          value={formatCompactAmount(stats.usedMaterialsCount)}
          icon={MdCheckCircle}
          subtitle="Marked as used"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statusOverview.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className="rounded-md border border-tableBorder/60 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-tableData">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-black text-tableHeading">
                    {formatNumberWithCommas(item.value)}
                  </p>
                </div>
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-md ring-1 ${item.className}`}
                >
                  <Icon size={18} />
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
        <SectionHeader
          title="Top Materials"
          subtitle="Latest materials included in the reporting snapshot."
        />
        <div className="mt-5">
          <ReusableTable
            columns={materialColumns}
            data={stats.recentMaterials ?? []}
            isLoading={isLoading}
            error={null}
            currentPage={1}
            totalPages={1}
            totalItems={stats.recentMaterials?.length ?? 0}
            itemsPerPage={5}
            setCurrentPage={() => undefined}
            setItemsPerPage={() => undefined}
            hasSerialNo={false}
            getRowId={(material) => material._id}
          />
        </div>
      </section>
      <section className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
        <SectionHeader
          title="Top Deployments"
          subtitle="Latest deployments included in the reporting snapshot."
        />
        <div className="mt-5">
          <ReusableTable
            columns={columns}
            data={stats.recentDeployments ?? []}
            isLoading={isLoading}
            error={null}
            currentPage={1}
            totalPages={1}
            totalItems={stats.recentDeployments?.length ?? 0}
            itemsPerPage={5}
            setCurrentPage={() => undefined}
            setItemsPerPage={() => undefined}
            hasSerialNo={false}
            getRowId={(deployment) => deployment._id}
          />
        </div>
      </section>
    </main>
  );
};

export default Reports;
