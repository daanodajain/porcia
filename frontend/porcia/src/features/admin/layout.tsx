import type { ReactNode } from "react";
import { BarChart3, Boxes, CreditCard, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { Card, Container } from "@/components/ui";
import { adminModules } from "./modules";

const stats = [
  { label: "Revenue", value: "EUR 1.8M", icon: CreditCard },
  { label: "Orders", value: "1,248", icon: Boxes },
  { label: "Customers", value: "3,906", icon: Users },
  { label: "Conversion", value: "4.9%", icon: BarChart3 },
] as const;

export function Sidebar() {
  return (
    <div className="grid gap-3">
      <div className="mb-4">
        <p className="lux-small uppercase tracking-[0.3em]">Admin Panel</p>
        <p className="lux-h3 mt-3">Porcia Control</p>
      </div>
      {adminModules.map((module) => (
        <div key={module} className="rounded-full border border-[var(--lux-border)] px-4 py-3 text-sm">
          {module}
        </div>
      ))}
    </div>
  );
}

export function Topbar() {
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div>
        <p className="lux-small uppercase tracking-[0.3em]">Dashboard Layout</p>
        <h1 className="mt-2 text-2xl">Enterprise admin foundation</h1>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-[var(--lux-border)] px-4 py-2 text-sm">
        <ShieldCheck size={16} />
        Full access
      </div>
    </Card>
  );
}

export function PermissionLayout() {
  return (
    <Card className="p-6">
      <p className="lux-small uppercase tracking-[0.3em]">Permission Layout</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {["Super Admin", "Operations", "Editorial"].map((item) => (
          <div key={item} className="rounded-[var(--lux-r-2)] border border-[var(--lux-border)] p-4">{item}</div>
        ))}
      </div>
    </Card>
  );
}

export function AuthenticationLayout() {
  return (
    <Card className="p-6">
      <p className="lux-small uppercase tracking-[0.3em]">Authentication Layout</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input className="h-12 rounded-full border border-[var(--lux-border)] bg-transparent px-5" placeholder="Work email" />
        <input className="h-12 rounded-full border border-[var(--lux-border)] bg-transparent px-5" placeholder="Password" />
      </div>
    </Card>
  );
}

export function DashboardLayout() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="p-6">
              <div className="flex items-center justify-between">
                <p className="lux-small uppercase tracking-[0.3em]">{item.label}</p>
                <Icon size={18} />
              </div>
              <p className="mt-8 text-3xl">{item.value}</p>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <p className="lux-small uppercase tracking-[0.3em]">Modules</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {adminModules.map((module) => (
              <div key={module} className="rounded-[var(--lux-r-2)] border border-[var(--lux-border)] p-4">
                {module}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} />
            <p className="lux-small uppercase tracking-[0.3em]">System State</p>
          </div>
          <div className="mt-4 grid gap-3 text-sm">
            <span>React Query ready for caching</span>
            <span>Axios layer ready for typed endpoints</span>
            <span>Forms ready for React Hook Form + Zod</span>
            <span>Charts slot reserved for Recharts</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminShell({
  sidebar,
  topbar,
  children,
}: {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Container className="grid gap-6 py-16 lg:grid-cols-[280px_1fr]">
      <Card className="self-start p-6 lg:sticky lg:top-28">{sidebar ?? <Sidebar />}</Card>
      <div className="grid gap-6">
        {topbar ?? <Topbar />}
        {children ?? <DashboardLayout />}
      </div>
    </Container>
  );
}

export function AdminPageContent() {
  return (
    <AdminShell>
      <PermissionLayout />
      <AuthenticationLayout />
      <DashboardLayout />
    </AdminShell>
  );
}

export const AdminLayout = AdminPageContent;
