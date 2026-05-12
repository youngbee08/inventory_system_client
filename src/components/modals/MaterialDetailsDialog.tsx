import type React from "react";
import {  PiWarningCircle } from "react-icons/pi";
import type { Material } from "../../lib/interfaces";
import {
  formatISODateToCustom,
  formatNumberWithCommas,
} from "../../utility/formatterUtilities";
import Modal from "./Modal";

interface MaterialDetailsDialogProps {
  isOpen: boolean;
  material: Material | null;
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="rounded-md border border-tableBorder bg-secondary px-4 py-3">
    <p className="text-[10px] font-bold uppercase text-fadedBlack">{label}</p>
    <div className="mt-1 text-sm font-bold text-tableHeading">{value}</div>
  </div>
);

const MaterialDetailsDialog: React.FC<MaterialDetailsDialogProps> = ({
  isOpen,
  material,
  isLoading = false,
  error,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-tableHeading">
              Material Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-tableData">
              Review stock quantity, location, threshold, and status.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-18 animate-pulse rounded-md bg-outlineBlack/60"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        ) : material ? (
          <>
            <div className="flex flex-col gap-2 rounded-md border border-tableBorder bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-extrabold text-tableHeading">
                  {material.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-tableData">
                  {material.location}
                </p>
              </div>
              <span
                className={`inline-flex w-fit items-center rounded-md px-2.5 py-1 text-[10px] font-bold ring-1 ${
                  material.isActive
                    ? "bg-emerald-50/20 text-emerald-700 ring-emerald-200"
                    : "bg-red-50/20 text-red-700 ring-red-200"
                }`}
              >
                {material.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Quantity"
                value={`${formatNumberWithCommas(material.quantity)} ${material.unit}`}
              />
              <DetailItem
                label="Threshold"
                value={`${formatNumberWithCommas(material.threshold)} ${material.unit}`}
              />
              <DetailItem label="Unit" value={material.unit} />
              <DetailItem label="Location" value={material.location} />
              <DetailItem
                label="Created"
                value={formatISODateToCustom(material.createdAt)}
              />
              <DetailItem
                label="Updated"
                value={formatISODateToCustom(material.updatedAt)}
              />
            </div>

            {material.quantity <= material.threshold && (
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-700">
                <PiWarningCircle size={16} className="mt-0.5 shrink-0" />
                This material is at or below its stock threshold.
              </div>
            )}
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export default MaterialDetailsDialog;
