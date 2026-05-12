import { useCallback, useEffect, useMemo, useState } from "react";
import type React from "react";
import { MdAdd } from "react-icons/md";
import { PiPower } from "react-icons/pi";
import { toast } from "sonner";
import ActionCell from "../../components/common/ActionCell";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import CreateMaterialDialog from "../../components/modals/CreateMaterialDialog";
import EditMaterialDialog from "../../components/modals/EditMaterialDialog";
import MaterialDetailsDialog from "../../components/modals/MaterialDetailsDialog";
import api, { getErrorMessage } from "../../helpers/api";
import type { Material, TableColumnProps } from "../../lib/interfaces";
import ReusableTable from "../../utility/ReuseableTable";
import {
  formatISODateToCustom,
  formatNumberWithCommas,
} from "../../utility/formatterUtilities";

const statusClasses = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-red-50 text-red-700 ring-red-200",
};

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );
  const [detailMaterial, setDetailMaterial] = useState<Material | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get("/materials");
      setMaterials((res.data.materials ?? []).toReversed());
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load materials"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSingleMaterial = async (material: Material) => {
    setSelectedMaterial(material);
    setDetailMaterial(null);
    setDetailError(null);
    setShowDetailModal(true);
    setIsDetailLoading(true);

    try {
      const res = await api.get(`/materials/${material._id}`);
      setDetailMaterial(res.data.material ?? res.data.data ?? res.data);
    } catch (err: unknown) {
      setDetailError(getErrorMessage(err, "Failed to load material details"));
    } finally {
      setIsDetailLoading(false);
    }
  };

  const columns: TableColumnProps<Material>[] = useMemo(
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
        render: (material) =>
          `${formatNumberWithCommas(material.quantity)} ${material.unit}`,
      },
      {
        label: "Location",
        key: "location",
      },
      {
        label: "Threshold",
        key: "threshold",
        render: (material) =>
          `${formatNumberWithCommas(material.threshold)} ${material.unit}`,
      },
      {
        label: "Status",
        key: "isActive",
        render: (material) => {
          const status = material.isActive ? "active" : "inactive";

          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClasses[status]}`}
            >
              {material.isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        label: "Created Date",
        key: "createdAt",
        render: (material) => formatISODateToCustom(material.createdAt),
      },
      {
        label: "Action",
        key: "action",
        render: (material) => (
          <ActionCell
            rowId={material._id}
            rowItem={material}
            onView={() => void fetchSingleMaterial(material)}
            onEdit={() => {
              setSelectedMaterial(material);
              setShowEditModal(true);
            }}
            otherAction={{
              label: material.isActive ? "Deactivate" : "Activate",
              icon: PiPower,
              isDanger: material.isActive,
              action: () => {
                setSelectedMaterial(material);
                setShowToggleModal(true);
              },
            }}
          />
        ),
      },
    ],
    [],
  );

  const toggleMaterialStatus = async () => {
    if (!selectedMaterial) return;

    setIsToggling(true);
    try {
      const res = await api.patch(
        `/materials/toggle-status/${selectedMaterial._id}`,
      );
      toast.success(
        res.data.message ||
          `${selectedMaterial.name} ${
            selectedMaterial.isActive ? "deactivated" : "activated"
          } successfully`,
      );
      setShowToggleModal(false);
      setSelectedMaterial(null);
      await fetchMaterials();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update material status"));
    } finally {
      setIsToggling(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMaterials();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchMaterials]);

  const toggleVerb = selectedMaterial?.isActive ? "deactivate" : "activate";
  const toggleLabel = selectedMaterial?.isActive ? "Deactivate" : "Activate";

  return (
    <>
      <section className="flex min-w-0 flex-col gap-5 lg:pb-0 pb-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-tableHeading">
              Materials
            </h1>
            <p className="mt-2 text-sm leading-6 text-tableData">
              Manage inventory stock, locations, reorder thresholds, and
              material availability.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 sm:w-auto"
          >
            <MdAdd size={17} />
            Add Material
          </button>
        </div>

        <div className="rounded-md border border-tableBorder bg-white p-4 shadow-sm shadow-primary/5 sm:p-5">
          <ReusableTable
            columns={columns}
            data={materials}
            isLoading={isLoading}
            error={error}
            currentPage={1}
            totalPages={1}
            totalItems={materials.length}
            itemsPerPage={10}
            setCurrentPage={() => undefined}
            setItemsPerPage={() => undefined}
            hasSerialNo={false}
            getRowId={(material) => material._id}
          />
        </div>
      </section>

      <CreateMaterialDialog
        isOpen={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onSuccess={fetchMaterials}
      />

      <EditMaterialDialog
        isOpen={showEditModal}
        material={selectedMaterial}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedMaterial(null);
        }}
        onSuccess={fetchMaterials}
      />

      <MaterialDetailsDialog
        isOpen={showDetailModal}
        material={detailMaterial}
        isLoading={isDetailLoading}
        error={detailError}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedMaterial(null);
          setDetailMaterial(null);
        }}
      />

      <ConfirmDialog
        isOpen={showToggleModal}
        title={`Are you sure you want to ${toggleVerb} this material?`}
        message={
          <p>
            This will mark{" "}
            <span className="font-bold text-tableHeading">
              {selectedMaterial?.name}
            </span>{" "}
            as {selectedMaterial?.isActive ? "inactive" : "active"} and update
            whether it is available for use.
          </p>
        }
        confirmText={toggleLabel}
        onCancel={() => {
          setShowToggleModal(false);
          setSelectedMaterial(null);
        }}
        onConfirm={toggleMaterialStatus}
        isLoading={isToggling}
      />
    </>
  );
};

export default Materials;
