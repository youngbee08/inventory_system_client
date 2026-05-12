import React, { useState } from "react";
import { toast } from "sonner";
import api, { getErrorMessage } from "../../helpers/api";
import Modal from "./Modal";

interface CreateEmployeeDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "h-10 w-full rounded-md border border-tableBorder bg-white px-4 text-xs text-tableHeading shadow-sm shadow-primary/5 outline-0 transition placeholder:text-fadedBlack focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({
  isOpen,
  onCancel,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/employees", {
        name,
        email,
        password,
      });
      toast.success(res.data.message || "Employee created successfully");
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to create employee"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="text-lg font-extrabold text-tableHeading">
            Add Employee
          </h2>
          <p className="mt-1 text-sm leading-6 text-tableData">
            Create an employee account for deployment assignments.
          </p>
        </div>

        <div className="grid gap-4">
          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Full Name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Folagbade Abdulazeem"
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Email Address
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="azeem@gmail.com"
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Password
            </span>
            <input
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              placeholder="12345678"
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
            {isSubmitting ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEmployeeDialog;
