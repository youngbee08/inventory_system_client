import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { FiPlus } from "react-icons/fi";
import Modal from "./Modal";
import SearchableSelect, {
  type SearchableSelectOption,
} from "../../utility/SearchableSelect";
import api, { getErrorMessage } from "../../helpers/api";
import type { Material } from "../../lib/interfaces";
import { formatNumberWithCommas } from "../../utility/formatterUtilities";
import { FaMinus } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

interface CreateDeploymentDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "h-10 w-full rounded-md border border-tableBorder bg-white px-4 text-xs text-tableHeading shadow-sm shadow-primary/5 outline-0 transition placeholder:text-fadedBlack focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

interface DeploymentMaterialFormEntry {
  rowId: string;
  material: string;
  quantity: string;
  selectedMaterial?: Material;
}

const createMaterialEntry = (): DeploymentMaterialFormEntry => ({
  rowId: uuidv4(),
  material: "",
  quantity: "",
});

const CreateDeploymentDialog: React.FC<CreateDeploymentDialogProps> = ({
  isOpen,
  onCancel,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [materials, setMaterials] = useState<DeploymentMaterialFormEntry[]>([
    createMaterialEntry(),
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const materialOptionsMapper = useCallback(
    (record: Material): SearchableSelectOption<Material> => ({
      value: record._id,
      label: record.name,
      description: `${record.location} - ${formatNumberWithCommas(record.quantity)} ${record.unit} available`,
      meta: `Threshold: ${formatNumberWithCommas(record.threshold)} ${record.unit}`,
      record,
    }),
    [],
  );

  const hasInvalidQuantity = useMemo(() => {
    return materials.some((entry) => {
      if (!entry.material || !entry.quantity || !entry.selectedMaterial) {
        return false;
      }

      return Number(entry.quantity) > entry.selectedMaterial.quantity;
    });
  }, [materials]);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setDestination("");
    setAssignedTo("");
    setMaterials([createMaterialEntry()]);
  };

  const updateMaterialEntry = (
    rowId: string,
    updates: Partial<DeploymentMaterialFormEntry>,
  ) => {
    setMaterials((currentMaterials) =>
      currentMaterials.map((entry) =>
        entry.rowId === rowId ? { ...entry, ...updates } : entry,
      ),
    );
  };

  const addMaterialEntry = () => {
    setMaterials((currentMaterials) => [
      ...currentMaterials,
      createMaterialEntry(),
    ]);
  };

  const removeMaterialEntry = (rowId: string) => {
    setMaterials((currentMaterials) =>
      currentMaterials.length === 1
        ? currentMaterials
        : currentMaterials.filter((entry) => entry.rowId !== rowId),
    );
  };

  const handleClose = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const invalidEntry = materials.find(
      (entry) =>
        entry.selectedMaterial &&
        Number(entry.quantity) > entry.selectedMaterial.quantity,
    );

    if (invalidEntry?.selectedMaterial) {
      toast.error(
        `${invalidEntry.selectedMaterial.name} only has ${formatNumberWithCommas(
          invalidEntry.selectedMaterial.quantity,
        )} ${invalidEntry.selectedMaterial.unit} available.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/deployments", {
        title,
        destination,
        assignedTo,
        materials: materials.map((entry) => ({
          material: entry.material,
          quantity: Number(entry.quantity),
        })),
      });
      toast.success(res.data.message || "Deployment created successfully");
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to create deployment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="text-lg font-extrabold text-tableHeading">
            Add Deployment
          </h2>
          <p className="mt-1 text-sm leading-6 text-tableData">
            Create a material dispatch and assign it to an employee.
          </p>
        </div>

        <div className="grid gap-4">
          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Title
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClass}
              placeholder="Deploy Cables to Ilorin"
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Destination
            </span>
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className={inputClass}
              placeholder="Kano"
              required
            />
          </label>

          <SearchableSelect
            label="Assigned Employee"
            value={assignedTo}
            onChange={setAssignedTo}
            placeholder="Select employee"
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-tableHeading">
                  Materials
                </h3>
                <p className="mt-1 text-[11px] text-tableData">
                  Add one or more material allocations for this deployment.
                </p>
              </div>
              <button
                type="button"
                onClick={addMaterialEntry}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-tableBorder bg-white px-3 text-xs font-bold text-primary transition hover:bg-tetiary"
              >
                <FiPlus size={14} />
                Add
              </button>
            </div>

            {materials.map((entry, index) => {
              const isQuantityInvalid =
                entry.selectedMaterial &&
                Number(entry.quantity) > entry.selectedMaterial.quantity;

              return (
                <div
                  key={entry.rowId}
                  className="rounded-md border border-tableBorder bg-secondary p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px_36px] sm:items-end">
                    <SearchableSelect<Material>
                      label={`Material ${index + 1}`}
                      value={entry.material}
                      endpoint="/materials"
                      responseKey="materials"
                      searchPlaceholder="Search materials"
                      placeholder="Select material"
                      mapOption={materialOptionsMapper}
                      onChange={(value, option) =>
                        updateMaterialEntry(entry.rowId, {
                          material: value,
                          quantity: "",
                          selectedMaterial: option?.record,
                        })
                      }
                    />

                    <label>
                      <span className="mb-2 block text-xs font-bold text-tableHeading">
                        Quantity
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={entry.selectedMaterial?.quantity}
                        value={entry.quantity}
                        disabled={!entry.material}
                        onChange={(event) => {
                          const nextQuantity = event.target.value;
                          const availableQuantity =
                            entry.selectedMaterial?.quantity;

                          if (
                            availableQuantity !== undefined &&
                            Number(nextQuantity) > availableQuantity
                          ) {
                            updateMaterialEntry(entry.rowId, {
                              quantity: String(availableQuantity),
                            });
                            return;
                          }

                          updateMaterialEntry(entry.rowId, {
                            quantity: nextQuantity,
                          });
                        }}
                        className={`${inputClass} ${
                          isQuantityInvalid
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : ""
                        }`}
                        placeholder="20"
                        required
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removeMaterialEntry(entry.rowId)}
                      disabled={materials.length === 1}
                      aria-label="Remove material"
                      className="grid h-10 w-full place-items-center rounded-md border border-tableBorder bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-9"
                    >
                      <FaMinus size={15} />
                    </button>
                  </div>

                  {entry.selectedMaterial && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <p className="rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-tableData ring-1 ring-tableBorder">
                        Available:{" "}
                        <span className="text-tableHeading">
                          {formatNumberWithCommas(
                            entry.selectedMaterial.quantity,
                          )}{" "}
                          {entry.selectedMaterial.unit}
                        </span>
                      </p>
                      <p className="rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-tableData ring-1 ring-tableBorder">
                        Location:{" "}
                        <span className="text-tableHeading">
                          {entry.selectedMaterial.location}
                        </span>
                      </p>
                      <p className="rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-tableData ring-1 ring-tableBorder">
                        Threshold:{" "}
                        <span className="text-tableHeading">
                          {formatNumberWithCommas(
                            entry.selectedMaterial.threshold,
                          )}{" "}
                          {entry.selectedMaterial.unit}
                        </span>
                      </p>
                    </div>
                  )}

                  {isQuantityInvalid && entry.selectedMaterial && (
                    <p className="mt-2 text-[11px] font-semibold text-red-600">
                      Quantity cannot exceed{" "}
                      {formatNumberWithCommas(entry.selectedMaterial.quantity)}{" "}
                      {entry.selectedMaterial.unit}.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-tableBorder bg-white px-4 text-xs font-bold text-tableHeading transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || hasInvalidQuantity}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? "Creating..." : "Create Deployment"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDeploymentDialog;
