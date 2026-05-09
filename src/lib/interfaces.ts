import React from "react";

export interface DashboardMetrics {
  totalMaterials: number;
  lowStockMaterials: number;
  totalInventoryQuantity: number;
}

export interface TableColumnProps<T = unknown> {
  label: string | React.ReactNode;
  key?: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  tableHeadingClassName?: string;
}

export interface ReusableTableProps<
  T extends { id?: number | string },
> extends PaginationControlProps {
  columns: TableColumnProps<T>[];
  isLoading: boolean;
  data: T[];
  error: unknown;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  hasSerialNo?: boolean;
  tableType?: string;
  selectable?: boolean;
  selectedRowIds?: Array<number | string>;
  onToggleRowSelection?: (id: number | string) => void;
  onToggleAllRows?: (checked: boolean) => void;
  getRowId?: (item: T, index: number) => number | string | undefined;
}

export interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  tableType?: string;
}

export interface UserProps {
  _id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UserContextType {
  user: UserProps | null;
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: (token: string) => Promise<void>;
  dashboardMetrics: DashboardMetrics;
  loading: boolean;
}
