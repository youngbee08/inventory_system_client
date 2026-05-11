import React from "react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes, Confirm",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onCancel}>
      <div className="pr-2">
        <div className="flex items-start gap-4">
          <div>
            <h4 className="text-sm lg:text-lg font-extrabold text-tableHeading">
              {title}
            </h4>
            <div className="mt-2 text-xs lg:text-sm leading-6 text-tableData">
              {typeof message === "string" ? <p>{message}</p> : message}
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-tableBorder bg-white px-4 text-xs font-bold text-tableHeading transition hover:bg-secondary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-red-600 px-4 text-xs font-bold text-white shadow-sm shadow-red-600/15 transition hover:bg-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
