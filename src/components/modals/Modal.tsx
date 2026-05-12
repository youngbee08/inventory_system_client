import React from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";

interface modalProps {
  children: React.ReactNode;
  onClose: () => void;
  showClose?: boolean;
  customMode?: boolean;
}

const Modal = ({
  children,
  onClose,
  showClose = true,
  customMode = false,
}: modalProps) => {
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    console.error('The "modal-root" element was not found in the DOM.');
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-tableHeading/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      {customMode ? (
        <div
          className="w-full max-w-md"
          onMouseDown={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      ) : (
        <div
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => event.stopPropagation()}
          className="relative w-full max-w-2xl overflow-hidden rounded-md border border-tableBorder bg-white shadow-xl shadow-tableHeading/20"
        >
          {showClose && (
            <button
              onClick={onClose}
              type="button"
              aria-label="Close modal"
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-md border border-tableBorder bg-secondary text-tableData transition hover:border-primary/20 hover:bg-tetiary hover:text-primary cursor-pointer"
            >
              <FiX size={18} />
            </button>
          )}

          <div className="max-h-[88vh] overflow-y-auto p-5 pr-5 styled-scrollbar sm:p-6 sm:pr-10">
            {children}
          </div>
        </div>
      )}
    </div>,
    modalRoot,
  );
};

export default Modal;
