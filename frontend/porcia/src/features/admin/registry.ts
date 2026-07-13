import { AdminLayout, Sidebar, Topbar, PermissionLayout, AuthenticationLayout, DashboardLayout } from "./layout";
import { adminModules } from "./modules";

export const adminShell = { AdminLayout, Sidebar, Topbar, PermissionLayout, AuthenticationLayout, DashboardLayout } as const;
export const adminPhaseModules = adminModules;
