/* eslint-disable react-hooks/refs */
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
  rowId: number | string;
  rowItem?: object;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  toggleAction?: () => void;
  onView?: (id: number | string) => void;
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
  const setReference = refs.setReference;
  const setFloating = refs.setFloating;

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
        ref={setReference}
        className={`hover:bg-primary/10 w-10 h-10 flex items-center justify-center rounded-md cursor-pointer ${open ? "bg-primary/20" : ""}`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <TfiMore size={14} className="rotate-90 text-primary" />
      </div>

      {/* 2. Wrap the menu in FloatingPortal */}
      {open && (
        <FloatingPortal>
          <div
            ref={setFloating}
            style={{ ...floatingStyles, zIndex: 9999 }} // Ensure it's above everything
            className="flex min-w-34 flex-col overflow-hidden rounded-md border border-tableBorder bg-white text-xs shadow-xl shadow-primary/10"
          >
            {(canView || onView) && (
              <button
                className="flex items-center gap-2 px-3 py-2.5 text-tableHeading hover:bg-tetiary cursor-pointer"
                onClick={() => {
                  toggleAction?.();
                  onView?.(rowId);
                  setOpen(false);
                }}
              >
                <FaEye /> View
              </button>
            )}
            {onEdit && (
              <button
                className="flex items-center gap-2 px-3 py-2.5 text-tableHeading hover:bg-tetiary cursor-pointer"
                onClick={() => {
                  toggleAction?.();
                  onEdit(rowId);
                  setOpen(false);
                }}
              >
                <FiEdit /> Edit
              </button>
            )}
            {otherAction && (
              <button
                className={`flex items-center gap-2 px-3 py-2.5 hover:bg-tetiary cursor-pointer ${otherAction.isDanger ? "text-red-600" : "text-tableHeading"} border-t border-tableBorder`}
                onClick={() => {
                  toggleAction?.();
                  otherAction.action();
                  setOpen(false);
                }}
              >
                <otherAction.icon /> {otherAction.label}
              </button>
            )}
            {onDelete && (
              <button
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-tetiary cursor-pointer text-red-600 border-t border-tableBorder"
                onClick={() => {
                  toggleAction?.();
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
