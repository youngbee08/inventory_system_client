import React from "react";
// import PaginationControls from "./PaginationControls";
import type { ReusableTableProps, TableColumnProps } from "../lib/interfaces";
import EmptyState from "../components/common/EmptyState";

const getDefaultRowId = <T extends object>(
  item: T,
): number | string | undefined => {
  const row = item as Record<string, unknown>;
  const rowId = row.id ?? row._id;

  return typeof rowId === "string" || typeof rowId === "number"
    ? rowId
    : undefined;
};

const ReusableTable = <T extends object>({
  columns,
  data,
  isLoading,
  error,
  currentPage,
  // totalPages,
  // totalItems,
  // setCurrentPage,
  hasSerialNo = true,
  // tableType,
  itemsPerPage,
  // setItemsPerPage,
  selectable = false,
  selectedRowIds = [],
  onToggleRowSelection,
  onToggleAllRows,
  getRowId,
}: ReusableTableProps<T>) => {
  const selectedRowSet = new Set(selectedRowIds);
  const selectableRowIds = data
    .map((item, index) =>
      getRowId ? getRowId(item, index) : getDefaultRowId(item),
    )
    .filter((id): id is number | string => id !== undefined && id !== null);
  const allRowsSelected =
    selectableRowIds.length > 0 &&
    selectableRowIds.every((id) => selectedRowSet.has(id));

  const columnsWithSN: TableColumnProps<T>[] = [
    ...(selectable
      ? [
          {
            label: (
              <label
                htmlFor="rowCheckBox"
                className="relative flex items-center cursor-pointer text-center"
              >
                <input
                  type="checkbox"
                  id="rowCheckBox"
                  className="peer appearance-none hidden size-4 rounded-md border border-tableBorder bg-secondary outline-0"
                  checked={allRowsSelected}
                  onChange={(e) => onToggleAllRows?.(e.target.checked)}
                />
                <span className="relative size-5 mx-auto pointer-events-none rounded border border-tableBorder bg-secondary peer-checked:bg-primary peer-checked:border-primary transition-all"></span>
                <span className="hidden peer-checked:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-0.5 w-[7px] h-3 border-r-3 border-b-3 border-white rotate-45"></span>
              </label>
            ),
            key: "bulk-select",
            render: (item: T, index: number) => {
              const rowId = getRowId
                ? getRowId(item, index)
                : getDefaultRowId(item);

              if (rowId === undefined || rowId === null) return null;

              return (
                <input
                  type="checkbox"
                  aria-label="Select row"
                  checked={selectedRowSet.has(rowId)}
                  onChange={() => onToggleRowSelection?.(rowId)}
                  className="size-5 rounded outline-0 cursor-pointer row-checkbox"
                />
              );
            },
            className:
              "p-3 text-center border-x border-tableBorder first:border-s-0 last:border-e-0",
            tableHeadingClassName: "text-center!",
          },
        ]
      : []),

    ...(hasSerialNo
      ? [
          {
            label: "S/N",
            key: "sn",
            render: (_: T, index: number) => {
              const serial = (currentPage - 1) * itemsPerPage + index + 1;
              return serial.toString().padStart(3, "0");
            },
            className:
              "px-3 py-2 text-[10px] text-start whitespace-nowrap font-medium",
          },
        ]
      : []),

    ...columns,
  ];

  return (
    <div className="min-w-0 max-w-full space-y-5">
      <div className="w-full max-w-full overflow-x-auto styled-scrollbar">
        <table className="w-full min-w-[720px] bg-white">
          <thead>
            <tr className="border-y border-tableBorder bg-secondary">
              {columnsWithSN.map((col, idx) => (
                <th
                  key={col.key ?? idx}
                  className={`px-3 py-3 text-left text-[10px] font-bold uppercase text-tableHeading whitespace-nowrap sm:px-4 sm:text-[11px] ${col.tableHeadingClassName ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }, (_, row) => (
                <tr key={row} className="border-b border-tableBorder">
                  {columnsWithSN.map((col, index) => (
                    <td key={col.key ?? index} className="px-3 py-4 sm:px-4">
                      <div className="h-3 w-full max-w-34 animate-pulse rounded bg-outlineBlack/70" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr className="border-b border-tableBorder">
                <td
                  colSpan={columnsWithSN.length}
                  className="px-3 py-5 text-center text-xs font-medium text-red-600 sm:px-4"
                >
                  {typeof error === "string"
                    ? error
                    : error instanceof Error
                      ? error.message
                      : "An error occurred"}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columnsWithSN.length} className="py-5">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={
                    (getRowId
                      ? getRowId(item, index)
                      : getDefaultRowId(item)) || index
                  }
                  className="border-b border-tableBorder last:border-b-0"
                >
                  {columnsWithSN.map((col, idx) => (
                    <td
                      key={col.key ?? idx}
                      className={
                        col.className ||
                        "px-3 py-4 text-xs font-medium text-tableData whitespace-nowrap sm:px-4"
                      }
                    >
                      {col.render
                        ? col.render(item, index)
                        : col.key
                          ? (item as Record<string, React.ReactNode>)[col.key]
                          : "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* {!isLoading && !error && data.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            tableType={tableType}
          />
        )} */}
      </div>
    </div>
  );
};

export default ReusableTable;
