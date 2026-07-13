"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut,
  Menu, Tag, Layers, BookOpen, X, Globe,
  BarChart3, Ticket, Star, Truck, Settings, Lock, Package2,
  type LucideIcon
} from "lucide-react";
import api from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  external?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Analytics",  icon: BarChart3 },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products",    label: "Products",    icon: Package },
      { href: "/admin/categories",  label: "Categories",  icon: Tag },
      { href: "/admin/brands",      label: "Brands",      icon: Layers },
      { href: "/admin/collections", label: "Collections", icon: BookOpen },
      { href: "/admin/inventory",   label: "Inventory",   icon: Package2 },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders",    label: "Orders",    icon: ShoppingCart },
      { href: "/admin/shipments", label: "Shipments", icon: Truck },
      { href: "/admin/payments",  label: "Payments",  icon: Tag },
      { href: "/admin/coupons",   label: "Coupons",   icon: Ticket },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/reviews",   label: "Reviews",   icon: Star },
    ],
  },
  {
    label: "Content (WordPress)",
    items: [
      { href: "https://cms.theporcia.com/wp-admin", label: "Edit Pages & Content", icon: Globe, external: true },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "/admin/admin-users", label: "Admin Users", icon: Lock },
      { href: "/admin/roles",       label: "Roles",       icon: Lock },
      { href: "/admin/settings",    label: "Settings",    icon: Settings },
    ],
  },
];

const navItems = navGroups.flatMap((g) => g.items);

const inputStyle: React.CSSProperties = {
  height: 40, width: "100%", border: "1px solid #e5e7eb", borderRadius: 8,
  padding: "0 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
  background: "#fff", color: "#111827",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("adminAuthToken"));
    setIsChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await api.post("/auth/admin/login", { email, password });
      const token = res.data.data?.accessToken;
      if (token) { localStorage.setItem("adminAuthToken", token); setIsAuthenticated(true); }
    } catch { setLoginError("Invalid credentials."); }
    finally { setIsLoggingIn(false); }
  };

  const handleLogout = () => { localStorage.removeItem("adminAuthToken"); setIsAuthenticated(false); };

  if (isChecking) return null;

  if (!isAuthenticated) {
    return (
      <div style={{ background: "#f9fafb", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 360, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b7280" }}>Porcia Admin</p>
          <h1 style={{ marginTop: 8, fontSize: 24, fontWeight: 700, color: "#111827" }}>Sign In</h1>
          <form onSubmit={handleLogin} style={{ marginTop: 24, display: "grid", gap: 12 }}>
            <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {loginError && <p style={{ fontSize: 13, color: "#ef4444" }}>{loginError}</p>}
            <button type="submit" disabled={isLoggingIn}
              style={{ height: 40, borderRadius: 8, background: "#111827", color: "#fff", border: "none", fontSize: 14, cursor: "pointer", opacity: isLoggingIn ? 0.6 : 1 }}>
              {isLoggingIn ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 20, background: "rgba(0,0,0,0.4)" }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside style={{
        position: "fixed", top: 0, left: sidebarOpen ? 0 : undefined, bottom: 0, zIndex: 30, width: 240,
        background: "#fff", borderRight: "1px solid #e5e7eb",
        display: "flex", flexDirection: "column",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      }}
        className="lg:static lg:translate-x-0 lg:flex"
      >
        {/* Logo */}
        <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontFamily: "serif", fontSize: 18, letterSpacing: "0.3em", color: "#111827" }}>PORCIA</span>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }} className="lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav Groups */}
        <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9ca3af", padding: "0 8px", marginBottom: 6 }}>
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = !item.external && pathname && (item.exact ? pathname === item.href : pathname.startsWith(item.href));

                const linkStyle: React.CSSProperties = {
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 8, marginBottom: 2,
                  fontSize: 13, textDecoration: "none",
                  background: active ? "#111827" : "transparent",
                  color: active ? "#fff" : "#374151",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                };

                if (item.external) {
                  return (
                    <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                      onClick={() => setSidebarOpen(false)} style={linkStyle}>
                      <Icon size={15} />
                      {item.label}
                      <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.5 }}>↗</span>
                    </a>
                  );
                }

                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={linkStyle}>
                    <Icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{ margin: 12, padding: "10px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#ef4444", background: "none", border: "1px solid #fee2e2", cursor: "pointer" }}>
          <LogOut size={15} /> Sign Out
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ height: 60, display: "flex", alignItems: "center", gap: 16, padding: "0 24px", background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151" }} className="lg:hidden">
            <Menu size={20} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            {navItems.find((n) => n.external ? false : pathname && (n.exact ? pathname === n.href : pathname.startsWith(n.href)))?.label ?? "Admin"}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>admin@porcia.com</span>
          </div>
        </header>
        <div style={{ padding: 24 }}>{children}</div>
      </main>
    </div>
  );
}
