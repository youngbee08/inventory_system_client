import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdArrowBack,
  MdEmail,
  MdInventory2,
  MdLocationOn,
  MdPerson,
} from "react-icons/md";
import { PiCalendarBlank, PiPackage, PiTruck } from "react-icons/pi";
import type { Deployment, DeploymentStatus } from "../../lib/interfaces";
import {
  formatISODateToCustom,
  formatNumberWithCommas,
  formatUnderScores,
} from "../../utility/formatterUtilities";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api, { getErrorMessage } from "../../helpers/api";
import ActionCell from "../../components/common/ActionCell";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import { useUser } from "../../contexts/user/UserContext";

const statusClasses: Record<DeploymentStatus, string> = {
  pending: "bg-amber-50/20 text-amber-700 ring-amber-200",
  in_transit: "bg-blue-50/20 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50/20 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50/20 text-red-700 ring-red-200",
};

const materialStatusClasses: Record<string, string> = {
  allocated: "bg-blue-50/20 text-blue-700 ring-blue-200",
  in_transit: "bg-indigo-50/20 text-indigo-700 ring-indigo-200",
  used: "bg-emerald-50/20 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50/20 text-amber-700 ring-amber-200",
  deployed: "bg-emerald-50/20 text-emerald-700 ring-emerald-200",
  returned: "bg-slate-50/20 text-slate-600 ring-slate-200",
  cancelled: "bg-red-50/20 text-red-700 ring-red-200",
};

const materialStatusFlow: Record<string, string | null> = {
  allocated: "in_transit",
  in_transit: "used",
  used: null,
};

const getMaterialName = (material: Deployment["materials"][number]) => {
  return typeof material.material === "string"
    ? material.material
    : material.material.name;
};

const getMaterialId = (material: Deployment["materials"][number]) => {
  return typeof material.material === "string"
    ? material.material
    : material.material._id;
};

const getMaterialMeta = (material: Deployment["materials"][number]) => {
  if (typeof material.material === "string") {
    return {
      location: "-",
      availableQuantity: "-",
      threshold: "-",
      unit: "",
    };
  }

  return {
    location: material.material.location,
    availableQuantity: formatNumberWithCommas(material.material.quantity),
    threshold: formatNumberWithCommas(material.material.threshold),
    unit: material.material.unit,
  };
};

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-outlineBlack/70 ${className}`} />
);

const SingleDeploymentSkeleton = () => {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-2xl">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="mt-4 h-8 w-4/5 max-w-120" />
          <SkeletonBlock className="mt-3 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-3/5" />
        </div>
        <SkeletonBlock className="h-8 w-24" />
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <article
            key={item}
            className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5"
          >
            <SkeletonBlock className="size-10" />
            <SkeletonBlock className="mt-4 h-3 w-24" />
            <SkeletonBlock className="mt-3 h-5 w-32" />
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {[0, 1].map((item) => (
          <article
            key={item}
            className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5"
          >
            <div className="flex items-center gap-3">
              <SkeletonBlock className="size-10" />
              <div className="flex-1">
                <SkeletonBlock className="h-4 w-40" />
                <SkeletonBlock className="mt-2 h-3 w-56 max-w-full" />
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="grid gap-2 sm:grid-cols-[140px_1fr]">
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="h-3 w-full" />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="size-10" />
          <div>
            <SkeletonBlock className="h-4 w-44" />
            <SkeletonBlock className="mt-2 h-3 w-64 max-w-full" />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <SkeletonBlock className="h-10 w-full" />
          {[0, 1, 2].map((row) => (
            <SkeletonBlock key={row} className="h-12 w-full" />
          ))}
        </div>
      </section>
    </main>
  );
};

const DeploymentState = ({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[55vh] items-center justify-center">
      <section className="w-full max-w-lg text-center">
        <h1 className="mt-5 text-lg font-extrabold text-tableHeading">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-tableData">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 items-center justify-center rounded-md border border-tableBorder bg-white px-4 text-xs font-bold text-tableHeading transition hover:bg-secondary"
          >
            Go Back
          </button>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

const SingleDeployment: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useUser();

  const { id } = useParams();
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<{
    id: string;
    name: string;
    currentStatus: string;
    nextStatus: string;
  } | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const assignedTo =
    typeof deployment?.assignedTo === "string" ? null : deployment?.assignedTo;
  const assignedToLabel =
    typeof deployment?.assignedTo === "string"
      ? deployment?.assignedTo
      : deployment?.assignedTo?.name;

  const reFetchDeployment = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/deployments/${id}`);
      setDeployment(res.data.deployment ?? null);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to load deployment");
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const updateMaterialStatus = async () => {
    if (!id || !selectedMaterial) return;

    setIsUpdatingStatus(true);
    try {
      const res = await api.patch(
        `/deployments/${id}/materials/${selectedMaterial.id}/status`,
        {
          status: selectedMaterial.nextStatus,
        },
      );
      toast.success(res.data.message || "Material status updated");
      setSelectedMaterial(null);
      await reFetchDeployment();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update material status"));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reFetchDeployment();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [reFetchDeployment]);

  if (isLoading) return <SingleDeploymentSkeleton />;

  if (error) {
    return (
      <DeploymentState
        title="Unable to load deployment"
        message={error}
        actionLabel="Retry"
        onAction={reFetchDeployment}
      />
    );
  }

  if (!deployment) {
    return (
      <DeploymentState
        title="Deployment not found"
        message="This deployment may have been removed, or the server returned an empty deployment response."
      />
    );
  }

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            onClick={() => {
              const deploymentsPath =
                role === "admin"
                  ? "/admin/deployments"
                  : "/dashboard/deployments";

              navigate(deploymentsPath);
            }}
            className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold text-primary transition hover:text-primary/80"
          >
            <MdArrowBack size={16} />
            Back to deployments
          </p>
          <h1 className="mt-4 text-2xl font-extrabold text-tableHeading">
            {deployment?.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-tableData">
            {role === "admin"
              ? "Review deployment destination, assigned employee, materials, and operational timestamps."
              : "Review deployment destinations, assigned tasks, material details, and operational timelines."}
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-md px-3 py-1.5 text-xs font-bold ring-1 ${deployment && statusClasses[deployment?.status]}`}
        >
          {formatUnderScores(deployment?.status ?? "", true)}
        </span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
          <span className="grid size-10 place-items-center rounded-md bg-tetiary text-primary">
            <MdLocationOn size={20} />
          </span>
          <p className="mt-4 text-xs font-semibold text-tableData">
            Destination
          </p>
          <p className="mt-2 text-lg font-extrabold text-tableHeading">
            {deployment?.destination}
          </p>
        </article>

        <article className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
          <span className="grid size-10 place-items-center rounded-md bg-tetiary text-primary">
            <MdPerson size={20} />
          </span>
          <p className="mt-4 text-xs font-semibold text-tableData">
            Assigned Employee
          </p>
          <p className="mt-2 text-lg font-extrabold text-tableHeading">
            {assignedToLabel}
          </p>
        </article>

        <article className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
          <span className="grid size-10 place-items-center rounded-md bg-tetiary text-primary">
            <PiPackage size={20} />
          </span>
          <p className="mt-4 text-xs font-semibold text-tableData">Materials</p>
          <p className="mt-2 text-lg font-extrabold text-tableHeading">
            {formatNumberWithCommas(deployment?.materials.length ?? 0)}
          </p>
        </article>

        <article className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
          <span className="grid size-10 place-items-center rounded-md bg-tetiary text-primary">
            <PiCalendarBlank size={20} />
          </span>
          <p className="mt-4 text-xs font-semibold text-tableData">Created</p>
          <p className="mt-2 text-sm font-extrabold text-tableHeading">
            {formatISODateToCustom(deployment?.createdAt ?? "")}
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <article className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-tetiary text-primary">
              <PiTruck size={20} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-tableHeading">
                Deployment Information
              </h2>
              <p className="mt-1 text-xs text-tableData">
                Core dispatch details and audit timestamps.
              </p>
            </div>
          </div>

          <dl className="mt-5 divide-y divide-tableBorder">
            {[
              ["Title", deployment?.title],
              ["Destination", deployment?.destination],
              [
                "Created At",
                formatISODateToCustom(deployment?.createdAt ?? ""),
              ],
              [
                "Updated At",
                formatISODateToCustom(deployment?.updatedAt ?? ""),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 py-3 sm:grid-cols-[140px_minmax(0,1fr)]"
              >
                <dt className="text-[11px] font-bold uppercase text-tableData">
                  {label}
                </dt>
                <dd className="min-w-0 text-xs font-semibold text-tableHeading [overflow-wrap:anywhere]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-tetiary text-primary">
              <MdPerson size={20} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-tableHeading">
                Assigned Employee
              </h2>
              <p className="mt-1 text-xs text-tableData">
                Employee responsible for this deployment?.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-tableBorder bg-secondary p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                BA
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-tableHeading">
                  {assignedTo?.name ?? "Unassigned"}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-tableData">
                  <MdEmail size={14} />
                  {assignedTo?.email ?? "No email available"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-white p-3 ring-1 ring-tableBorder">
                <p className="text-[11px] font-bold uppercase text-tableData">
                  Role
                </p>
                <p className="mt-1 text-xs font-bold text-tableHeading">
                  {formatUnderScores(assignedTo?.role ?? "-", true)}
                </p>
              </div>
              <div className="rounded-md bg-white p-3 ring-1 ring-tableBorder">
                <p className="text-[11px] font-bold uppercase text-tableData">
                  Employee ID
                </p>
                <p className="mt-1 text-xs font-bold text-tableHeading [overflow-wrap:anywhere]">
                  {assignedTo?._id ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-tetiary text-primary">
            <MdInventory2 size={20} />
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-tableHeading">
              Deployment Materials
            </h2>
            <p className="mt-1 text-xs text-tableData">
              Materials allocated to this dispatch.
            </p>
          </div>
        </div>

        <div className="mt-5 max-w-full overflow-x-auto styled-scrollbar">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-y border-tableBorder bg-secondary">
                {[
                  "Material",
                  "Requested Qty",
                  "Available Stock",
                  "Threshold",
                  "Location",
                  "Status",
                  "Action",
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
              {deployment?.materials.map((material) => {
                const meta = getMaterialMeta(material);
                const materialId = getMaterialId(material);
                const nextStatus = materialStatusFlow[material.status] ?? null;

                return (
                  <tr
                    key={getMaterialName(material)}
                    className="border-b border-tableBorder last:border-b-0"
                  >
                    <td className="px-4 py-4 text-xs font-bold text-tableHeading">
                      {getMaterialName(material)}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-tableData">
                      {formatNumberWithCommas(material.quantity)} {meta.unit}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-tableData">
                      {meta.availableQuantity} {meta.unit}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-tableData">
                      {meta.threshold} {meta.unit}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-tableData">
                      {meta.location}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold ring-1 ${
                          materialStatusClasses[material.status] ??
                          "bg-slate-50 text-slate-600 ring-slate-200"
                        }`}
                      >
                        {formatUnderScores(material.status, true)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {nextStatus ? (
                        <ActionCell
                          rowId={materialId}
                          otherAction={{
                            label: `Mark ${formatUnderScores(nextStatus, true)}`,
                            icon: PiTruck,
                            action: () =>
                              setSelectedMaterial({
                                id: materialId,
                                name: getMaterialName(material),
                                currentStatus: material.status,
                                nextStatus,
                              }),
                          }}
                        />
                      ) : (
                        <span className="text-xs font-semibold text-tableData">
                          Final
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        isOpen={Boolean(selectedMaterial)}
        title="Update material status?"
        message={
          selectedMaterial
            ? `${selectedMaterial.name} will move from ${formatUnderScores(
                selectedMaterial.currentStatus,
                true,
              )} to ${formatUnderScores(
                selectedMaterial.nextStatus,
                true,
              )}. This status change is irreversible and cannot be reverted.`
            : ""
        }
        confirmText="Update Status"
        onCancel={() => setSelectedMaterial(null)}
        onConfirm={updateMaterialStatus}
        isLoading={isUpdatingStatus}
      />
    </main>
  );
};

export default SingleDeployment;
