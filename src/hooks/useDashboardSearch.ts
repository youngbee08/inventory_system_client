import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../helpers/api";
import type { Activity, Deployment, Material, UserProps } from "../lib/interfaces";
import { navItems } from "../lib/navitems";
import { formatUnderScores } from "../utility/formatterUtilities";

type DashboardRole = "admin" | "employee";

export type SearchResultType =
  | "Page"
  | "Deployment"
  | "Material"
  | "Employee"
  | "Activity"
  | "Report";

export interface DashboardSearchResult {
  id: string;
  title: string;
  type: SearchResultType;
  route: string;
  moduleLabel?: string;
  description?: string;
  keywords: unknown[];
}

interface SearchCollections {
  deployments: Deployment[];
  materials: Material[];
  employees: UserProps[];
  activities: Activity[];
}

const EMPTY_COLLECTIONS: SearchCollections = {
  deployments: [],
  materials: [],
  employees: [],
  activities: [],
};

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 8;

const normalize = (value: unknown) => String(value ?? "").toLowerCase().trim();

const includesQuery = (values: unknown[], query: string) =>
  values.some((value) => normalize(value).includes(query));

const getAssignedToLabel = (assignedTo: Deployment["assignedTo"]) => {
  if (typeof assignedTo === "string") return assignedTo;
  return assignedTo?.name ?? "";
};

const getMaterialLabels = (deployment: Deployment) =>
  deployment.materials
    .map((item) =>
      typeof item.material === "string" ? item.material : item.material?.name,
    )
    .filter(Boolean);

const getRolePages = (role: DashboardRole): DashboardSearchResult[] => {
  const navigationPages = navItems
    .filter((item) => item.role.includes(role))
    .map((item) => ({
      id: `page-${item.path}`,
      title: item.name,
      type: "Page" as const,
      route: item.path,
      moduleLabel: "Navigation",
      description: `${item.name} page`,
      keywords: [item.name, item.path, "dashboard", "navigation"],
    }));

  const sharedPages: DashboardSearchResult[] = [
    {
      id: "page-settings",
      title: "Settings",
      type: "Page",
      route: "/dashboard/settings",
      moduleLabel: "Account",
      description: "Profile and account preferences",
      keywords: ["settings", "profile", "account"],
    },
    {
      id: "page-notifications",
      title: "Notifications",
      type: "Page",
      route: "/dashboard/notifications",
      moduleLabel: "Account",
      description: "Dashboard notifications",
      keywords: ["notifications", "alerts", "updates"],
    },
  ];

  return [...navigationPages, ...sharedPages];
};

const getReportReferences = (role: DashboardRole): DashboardSearchResult[] => {
  if (role !== "admin") return [];

  return [
    {
      id: "report-inventory-health",
      title: "Inventory Health",
      type: "Report",
      route: "/admin/reports",
      moduleLabel: "Reports",
      description: "Inventory quantities, low stock, and material usage",
      keywords: ["inventory", "health", "materials", "low stock", "usage"],
    },
    {
      id: "report-deployment-performance",
      title: "Deployment Performance",
      type: "Report",
      route: "/admin/reports",
      moduleLabel: "Reports",
      description: "Pending, in-transit, completed, and cancelled deployments",
      keywords: ["deployment", "performance", "pending", "completed"],
    },
  ];
};

const buildDataResults = (
  collections: SearchCollections,
  role: DashboardRole,
): DashboardSearchResult[] => {
  const deploymentResults = collections.deployments.map((deployment) => ({
    id: `deployment-${deployment._id}`,
    title: deployment.title,
    type: "Deployment" as const,
    route: `/general/deployments/${deployment._id}`,
    moduleLabel: getAssignedToLabel(deployment.assignedTo) || "Deployments",
    description: deployment.destination,
    keywords: [
      deployment.title,
      deployment.destination,
      deployment.status,
      getAssignedToLabel(deployment.assignedTo),
      ...getMaterialLabels(deployment),
    ],
  }));

  const activityResults = collections.activities.map((activity) => ({
    id: `activity-${activity._id}`,
    title: activity.message || activity.action,
    type: "Activity" as const,
    route: "/general/activities",
    moduleLabel: activity.performedBy?.name || "Activity Log",
    description: activity.action,
    keywords: [
      activity.message,
      activity.action,
      activity.performedBy?.name,
      typeof activity.material === "string"
        ? activity.material
        : activity.material?.name,
      typeof activity.deployment === "string"
        ? activity.deployment
        : activity.deployment?.title,
    ],
  }));

  if (role !== "admin") {
    return [...deploymentResults, ...activityResults];
  }

  const materialResults = collections.materials.map((material) => ({
    id: `material-${material._id}`,
    title: material.name,
    type: "Material" as const,
    route: "/admin/materials",
    moduleLabel: material.location,
    description: `${material.quantity} ${material.unit} available`,
    keywords: [
      material.name,
      material.location,
      material.unit,
      material.isActive ? "active" : "inactive",
      material.quantity,
      material.threshold,
    ],
  }));

  const employeeResults = collections.employees.map((employee) => ({
    id: `employee-${employee._id}`,
    title: employee.name,
    type: "Employee" as const,
    route: "/admin/employees",
    moduleLabel: formatUnderScores(employee.role, true),
    description: employee.email,
    keywords: [employee.name, employee.email, employee.role, employee._id],
  }));

  return [
    ...deploymentResults,
    ...materialResults,
    ...employeeResults,
    ...activityResults,
  ];
};

const fetchSearchCollections = async (
  role: DashboardRole,
): Promise<SearchCollections> => {
  const requests = [
    api.get("/deployments"),
    api.get("/activities", { params: { page: 1, limit: 25 } }),
  ];

  if (role === "admin") {
    requests.push(api.get("/materials"), api.get("/auth/employees"));
  }

  const [deploymentsRes, activitiesRes, materialsRes, employeesRes] =
    await Promise.allSettled(requests);

  return {
    deployments:
      deploymentsRes.status === "fulfilled"
        ? (deploymentsRes.value.data.deployments ?? [])
        : [],
    activities:
      activitiesRes.status === "fulfilled"
        ? (activitiesRes.value.data.activities ?? [])
        : [],
    materials:
      materialsRes?.status === "fulfilled"
        ? (materialsRes.value.data.materials ?? [])
        : [],
    employees:
      employeesRes?.status === "fulfilled"
        ? (employeesRes.value.data.employees ?? [])
        : [],
  };
};

export const useDebouncedValue = <T,>(value: T, delay = 220) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
};

export const useDashboardSearch = (role?: string | null) => {
  const normalizedRole = role === "admin" || role === "employee" ? role : null;
  const [query, setQuery] = useState("");
  const [collections, setCollections] =
    useState<SearchCollections>(EMPTY_COLLECTIONS);
  const [collectionsRole, setCollectionsRole] = useState<DashboardRole | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebouncedValue(query);
  const trimmedQuery = normalize(debouncedQuery);

  const loadSearchData = useCallback(async () => {
    if (!normalizedRole || collectionsRole === normalizedRole || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const nextCollections = await fetchSearchCollections(normalizedRole);
      setCollections(nextCollections);
      setCollectionsRole(normalizedRole);
    } finally {
      setIsLoading(false);
    }
  }, [collectionsRole, isLoading, normalizedRole]);

  useEffect(() => {
    if (trimmedQuery.length >= MIN_QUERY_LENGTH) {
      const timeoutId = window.setTimeout(() => {
        void loadSearchData();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [loadSearchData, trimmedQuery]);

  const searchableItems = useMemo(() => {
    if (!normalizedRole) return [];

    const roleCollections =
      collectionsRole === normalizedRole ? collections : EMPTY_COLLECTIONS;

    return [
      ...getRolePages(normalizedRole),
      ...getReportReferences(normalizedRole),
      ...buildDataResults(roleCollections, normalizedRole),
    ];
  }, [collections, collectionsRole, normalizedRole]);

  const results = useMemo(() => {
    if (!trimmedQuery || trimmedQuery.length < MIN_QUERY_LENGTH) return [];

    return searchableItems
      .filter((item) =>
        includesQuery(
          [
            item.title,
            item.type,
            item.moduleLabel,
            item.description,
            item.route,
            ...item.keywords,
          ],
          trimmedQuery,
        ),
      )
      .slice(0, MAX_RESULTS);
  }, [searchableItems, trimmedQuery]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasSearched: trimmedQuery.length >= MIN_QUERY_LENGTH,
  };
};
