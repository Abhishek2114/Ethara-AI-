import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CalendarCheck,
  Calendar,
  CalendarOff,
  FolderKanban,
  BarChart3,
} from "lucide-react";
import { ROLES } from "./brand";

const allNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["*"] },
  { to: "/taskers", icon: Users, label: "My Taskers", roles: [ROLES.QUALITY_REVIEWER, ROLES.PROJECT_LEAD, ROLES.ADMIN] },
  { to: "/task-review", icon: ClipboardCheck, label: "Task Review", roles: [ROLES.QUALITY_REVIEWER, ROLES.PROJECT_LEAD, ROLES.ADMIN] },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance", roles: ["*"] },
  { to: "/attendance/reports", icon: Calendar, label: "Attendance Reports", roles: ["*"] },
  { to: "/leave", icon: CalendarOff, label: "Leave Management", roles: ["*"] },
  { to: "/projects", icon: FolderKanban, label: "Projects and Allocations", roles: ["*"] },
  { to: "/analytics", icon: BarChart3, label: "Team Analytics", roles: [ROLES.QUALITY_REVIEWER, ROLES.PROJECT_LEAD, ROLES.ADMIN] },
];

export function getNavForRole(role) {
  return allNav.filter(
    (item) => item.roles.includes("*") || item.roles.includes(role)
  );
}
