import React, { useState } from "react";
import { toast } from "sonner";
import Modal from "./Modal";
import type { Deployment } from "../../lib/interfaces";
import SearchableSelect from "../../utility/SearchableSelect";
import api, { getErrorMessage } from "../../helpers/api";

interface EditDeploymentDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  deployment: Deployment | null;
  onSuccess?: () => void;
}

const inputClass =
  "h-10 w-full rounded-md border border-tableBorder bg-white px-4 text-xs text-tableHeading shadow-sm shadow-primary/5 outline-0 transition placeholder:text-fadedBlack focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

const EditDeploymentForm = ({
  deployment,
  onCancel,
  onSuccess,
}: {
  deployment: Deployment;
  onCancel: () => void;
  onSuccess?: () => void;
}) => {
  const [title, setTitle] = useState(deployment.title);
  const [destination, setDestination] = useState(deployment.destination);
  const [assignedTo, setAssignedTo] = useState(
    typeof deployment.assignedTo === "string"
      ? deployment.assignedTo
      : String(deployment?.assignedTo?._id),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await api.patch(`/deployments/${deployment._id}`, {
        title,
        destination,
        assignedTo,
      });
      toast.success(res.data.message || "Deployment updated successfully");
      onSuccess?.();
      onCancel();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update deployment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold text-tableHeading">
          Edit Deployment
        </h2>
        <p className="mt-1 text-sm leading-6 text-tableData">
          Update the dispatch title, destination, and assigned employee.
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
            placeholder="Deployment title"
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
            placeholder="Deployment destination"
            required
          />
        </label>

        <SearchableSelect
          label="Assigned Employee"
          value={assignedTo}
          onChange={setAssignedTo}
          placeholder="Select employee"
        />
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

const EditDeploymentDialog: React.FC<EditDeploymentDialogProps> = ({
  isOpen,
  onCancel,
  deployment,
  onSuccess,
}) => {
  if (!isOpen || !deployment) return null;

  return (
    <Modal onClose={onCancel}>
      <EditDeploymentForm
        key={deployment._id}
        deployment={deployment}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};

export default EditDeploymentDialog;
