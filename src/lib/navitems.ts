import { FaUsers } from "react-icons/fa6";
import { MdContentPaste } from "react-icons/md";
import { PiChartBar, PiPackage, PiSquaresFour, PiTruck } from "react-icons/pi";

export const navItems = [
  {
    name: "Dashboard",
    icon: PiSquaresFour,
    path: "/admin/overview",
    role: ["admin"],
  },
  {
    name: "Employees",
    icon: FaUsers,
    path: "/admin/employees",
    role: ["admin"],
  },
  {
    name: "Materials",
    icon: PiPackage,
    path: "/admin/materials",
    role: ["admin"],
  },
  {
    name: "Deployments",
    icon: PiTruck,
    path: "/admin/deployments",
    role: ["admin"],
  },
  {
    name: "Reports",
    icon: MdContentPaste,
    path: "/admin/reports",
    role: ["admin"],
  },
  {
    name: "Dashboard",
    icon: PiSquaresFour,
    path: "/dashboard/overview",
    role: ["employee"],
  },
  {
    name: "Deployments",
    icon: PiTruck,
    path: "/dashboard/deployments",
    role: ["employee"],
  },
  {
    name: "Activity Log",
    icon: PiChartBar,
    path: "/general/activities",
    role: ["admin", "employee"],
  },
];
