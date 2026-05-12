import React, { useState } from "react";
import { toast } from "sonner";
import api, { getErrorMessage } from "../../helpers/api";
import Modal from "./Modal";

interface CreateMaterialDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "h-10 w-full rounded-md border border-tableBorder bg-white px-4 text-xs text-tableHeading shadow-sm shadow-primary/5 outline-0 transition placeholder:text-fadedBlack focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

const CreateMaterialDialog: React.FC<CreateMaterialDialogProps> = ({
  isOpen,
  onCancel,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [threshold, setThreshold] = useState("");
  const [unit, setUnit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setQuantity("");
    setLocation("");
    setThreshold("");
    setUnit("");
  };

  const handleClose = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await api.post("/materials/create", {
        name,
        quantity: Number(quantity),
        location,
        threshold: Number(threshold),
        unit,
      });
      toast.success(res.data.message || "Material created successfully");
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to create material"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="text-lg font-extrabold text-tableHeading">
            Add Material
          </h2>
          <p className="mt-1 text-sm leading-6 text-tableData">
            Create a stock item with its current quantity, unit, and reorder
            threshold.
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
              placeholder="Wire"
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Quantity
            </span>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className={inputClass}
              placeholder="100"
              required
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
            onClick={handleClose}
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
            {isSubmitting ? "Creating..." : "Create Material"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateMaterialDialog;
