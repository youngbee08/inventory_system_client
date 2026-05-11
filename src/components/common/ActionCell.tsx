import React, { useState, useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa6";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { TfiMore } from "react-icons/tfi";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import type { IconType } from "react-icons";

interface ActionCellProps {
  rowId: number;
  rowItem?: object;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  toggleAction?: () => void;
  onView?: (id: number) => void;
  canView?: boolean;
  otherAction?: {
    label: string;
    action: () => void;
    icon: IconType;
    isDanger?: boolean;
  } | null;
}

const ActionCell: React.FC<ActionCellProps> = ({
  rowId,
  onEdit,
  otherAction,
  onDelete,
  onView,
  canView = false,
  toggleAction,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        const floatingEl = refs.floating.current;
        if (floatingEl && floatingEl.contains(event.target as Node)) return;

        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, refs.floating]);

  return (
    <div className="flex justify-center items-center" ref={dropdownRef}>
      <div
        ref={refs.setReference}
        className={`hover:bg-primary/10 w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${open ? "bg-primary/20" : ""}`}
        onClick={() => {
          setOpen(!open);
          toggleAction?.();
        }}
      >
        <TfiMore size={14} className="rotate-90 text-primary" />
      </div>

      {/* 2. Wrap the menu in FloatingPortal */}
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 9999 }} // Ensure it's above everything
            className="flex flex-col bg-white rounded shadow-xl border border-gray-100 min-w-32 text-xs"
          >
            {(canView || onView) && (
              <button
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onView?.(rowId);
                  setOpen(false);
                }}
              >
                <FaEye /> View
              </button>
            )}
            {onEdit && (
              <button
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onEdit(rowId);
                  setOpen(false);
                }}
              >
                <FiEdit /> Edit
              </button>
            )}
            {otherAction && (
              <button
                className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer ${otherAction.isDanger && "text-red-600"} border-t border-gray-50`}
                onClick={() => {
                  otherAction.action();
                  setOpen(false);
                }}
              >
                <otherAction.icon /> {otherAction.label}
              </button>
            )}
            {onDelete && (
              <button
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600 border-t border-gray-50"
                onClick={() => {
                  onDelete(rowId);
                  setOpen(false);
                }}
              >
                <FiTrash2 /> Delete
              </button>
            )}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

export default ActionCell;
