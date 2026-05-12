import React, { useState } from "react";
import { PiInfo } from "react-icons/pi";
import { toast } from "sonner";
import api, { getErrorMessage } from "../../helpers/api";
import type { Material } from "../../lib/interfaces";
import Modal from "./Modal";

interface EditMaterialDialogProps {
  isOpen: boolean;
  material: Material | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "h-10 w-full rounded-md border border-tableBorder bg-white px-4 text-xs text-tableHeading shadow-sm shadow-primary/5 outline-0 transition placeholder:text-fadedBlack focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

const EditMaterialForm = ({
  material,
  onCancel,
  onSuccess,
}: {
  material: Material;
  onCancel: () => void;
  onSuccess?: () => void;
}) => {
  const [name, setName] = useState(material.name);
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState(material.location);
  const [threshold, setThreshold] = useState(String(material.threshold));
  const [unit, setUnit] = useState(material.unit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: Partial<Pick<Material, "name" | "quantity" | "location" | "threshold" | "unit">> = {
      name,
      location,
      threshold: Number(threshold),
      unit,
    };

    if (quantity !== "") {
      payload.quantity = Number(quantity);
    }

    setIsSubmitting(true);
    try {
      const res = await api.patch(`/materials/update/${material._id}`, payload);
      toast.success(res.data.message || "Material updated successfully");
      onSuccess?.();
      onCancel();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update material"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold text-tableHeading">
          Edit Material
        </h2>
        <p className="mt-1 text-sm leading-6 text-tableData">
          Update material details. Quantity changes are added to existing stock.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-2 block text-xs font-bold text-tableHeading">
            Material Name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Copper Cable"
            required
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold text-tableHeading">
            Quantity to Add
          </span>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className={inputClass}
            placeholder="100"
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold text-tableHeading">
            Threshold
          </span>
          <input
            type="number"
            min="0"
            value={threshold}
            onChange={(event) => setThreshold(event.target.value)}
            className={inputClass}
            placeholder="20"
            required
          />
        </label>

        <div className="sm:col-span-2 rounded-md border border-primary/15 bg-tetiary px-3 py-2 text-[11px] font-semibold leading-5 text-primary">
          <span className="inline-flex items-center gap-2">
            <PiInfo size={15} />
            This quantity will be added to the existing quantity.
          </span>
        </div>

        <label>
          <span className="mb-2 block text-xs font-bold text-tableHeading">
            Location
          </span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className={inputClass}
            placeholder="Lagos"
            required
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold text-tableHeading">
            Unit
          </span>
          <input
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            className={inputClass}
            placeholder="meters"
            required
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-10 w-full items-center justify-center rounded-md border border-tableBorder bg-white px-4 text-xs font-bold text-tableHeading transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

const EditMaterialDialog: React.FC<EditMaterialDialogProps> = ({
  isOpen,
  material,
  onCancel,
  onSuccess,
}) => {
  if (!isOpen || !material) return null;

  return (
    <Modal onClose={onCancel}>
      <EditMaterialForm
        key={material._id}
        material={material}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};

export default EditMaterialDialog;
