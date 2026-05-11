import React from "react";

export interface SafeUserProps {
  _id: number | string;
  name: string;
}
export interface UserProps extends SafeUserProps {
  email: string;
  role: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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

export interface DashboardMetrics {
  employeeAssignedDeployments: number;
  employeeCompletedDeployments: number;
  employeePendingMaterials: number;
  employeeInTransitMaterials: number;
  totalMaterials: number;
  lowStockMaterials: number;
  totalDeployments: number;
  recentActivities: Activity[];
}
export interface Activity {
  _id: string;
  action: string;
  message: string;
  performedBy: SafeUserProps;
  material: string;
  createdAt: string;
}

export type DeploymentStatus =
  | "pending"
  | "in_transit"
  | "completed"
  | "cancelled";

export type DeploymentMaterialStatus =
  | "allocated"
  | "pending"
  | "deployed"
  | "returned"
  | "cancelled";

export interface DeploymentMaterial {
  material:
    | string
    | Material;
  quantity: number;
  status: DeploymentMaterialStatus | string;
}

export interface Material {
  _id: string;
  name: string;
  quantity: number;
  location: string;
  threshold: number;
  isActive: boolean;
  unit: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Deployment {
  _id: string;
  title: string;
  destination: string;
  assignedTo: string | UserProps;
  status: DeploymentStatus;
  materials: DeploymentMaterial[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface TableColumnProps<T = unknown> {
  label: string | React.ReactNode;
  key?: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  tableHeadingClassName?: string;
}

export interface ReusableTableProps<T extends object>
  extends PaginationControlProps {
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
