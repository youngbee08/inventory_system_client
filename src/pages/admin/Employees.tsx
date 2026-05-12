import { useCallback, useEffect, useMemo, useState } from "react";
import type React from "react";
import { MdAdd } from "react-icons/md";
import CreateEmployeeDialog from "../../components/modals/CreateEmployeeDialog";
import api, { getErrorMessage } from "../../helpers/api";
import type { TableColumnProps, UserProps } from "../../lib/interfaces";
import ReusableTable from "../../utility/ReuseableTable";
import {
  formatISODateToCustom,
  formatUnderScores,
} from "../../utility/formatterUtilities";

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<UserProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get("/auth/employees");
      setEmployees((res.data.employees ?? []).toReversed());
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load employees"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const columns: TableColumnProps<UserProps>[] = useMemo(
    () => [
      {
        label: "Employee Name",
        key: "name",
        className:
          "px-4 py-4 text-xs font-bold text-tableHeading whitespace-nowrap",
      },
      {
        label: "Email Address",
        key: "email",
      },
      {
        label: "Role",
        key: "role",
        render: (employee) => (
          <span className="inline-flex items-center rounded-md bg-tetiary px-2.5 py-1 text-[10px] font-bold text-primary ring-1 ring-primary/10">
            {formatUnderScores(employee.role, true)}
          </span>
        ),
      },
      {
        label: "Created Date",
        key: "createdAt",
        render: (employee) => formatISODateToCustom(employee.createdAt ?? ""),
      },
      {
        label: "Employee ID",
        key: "_id",
        render: (employee) => (
          <span className="font-semibold text-tableData">
            {String(employee._id)}
          </span>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEmployees();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchEmployees]);

  return (
    <>
      <section className="flex min-w-0 flex-col gap-5 pb-20 lg:pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-tableHeading">
              Employees
            </h1>
            <p className="mt-2 text-sm leading-6 text-tableData">
              Manage employee accounts used for deployment assignments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 sm:w-auto"
          >
            <MdAdd size={17} />
            Add Employee
          </button>
        </div>

        <div className="rounded-md border border-tableBorder bg-white p-4 shadow-sm shadow-primary/5 sm:p-5">
          <ReusableTable
            columns={columns}
            data={employees}
            isLoading={isLoading}
            error={error}
            currentPage={1}
            totalPages={1}
            totalItems={employees.length}
            itemsPerPage={10}
            setCurrentPage={() => undefined}
            setItemsPerPage={() => undefined}
            hasSerialNo={false}
            getRowId={(employee) => employee._id}
          />
        </div>
      </section>

      <CreateEmployeeDialog
        isOpen={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onSuccess={fetchEmployees}
      />
    </>
  );
};

export default Employees;
