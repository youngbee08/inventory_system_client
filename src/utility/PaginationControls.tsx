import type React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setItemsPerPage?: React.Dispatch<React.SetStateAction<number>>;
  tableType?: string;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  tableType = "records",
}: PaginationControlsProps) => {
  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex flex-col gap-3 border-t border-tableBorder pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-medium text-tableData">
        Showing{" "}
        <span className="font-bold text-tableHeading">{startItem}</span> to{" "}
        <span className="font-bold text-tableHeading">{endItem}</span> of{" "}
        <span className="font-bold text-tableHeading">{totalItems}</span>{" "}
        {tableType}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {setItemsPerPage && (
          <label className="flex items-center gap-2 text-xs font-medium text-tableData">
            Rows
            <select
              value={itemsPerPage}
              onChange={(event) => {
                setItemsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="h-9 rounded-md border border-tableBorder bg-white px-2 text-xs font-bold text-tableHeading outline-0 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            >
              {[5, 10, 20, 50].map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isFirstPage}
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            className="h-9 rounded-md border border-tableBorder bg-white px-3 text-xs font-bold text-tableHeading transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="rounded-md bg-secondary px-3 py-2 text-xs font-bold text-tableHeading ring-1 ring-tableBorder">
            {currentPage} / {Math.max(totalPages, 1)}
          </span>
          <button
            type="button"
            disabled={isLastPage || totalPages === 0}
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            className="h-9 rounded-md border border-tableBorder bg-white px-3 text-xs font-bold text-tableHeading transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
