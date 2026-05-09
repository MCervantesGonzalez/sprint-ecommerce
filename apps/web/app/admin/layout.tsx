"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/orders",
    label: "Órdenes",
    icon: ShoppingBag,
  },
  {
    href: "/admin/products",
    label: "Productos",
    icon: Package,
  },
  {
    href: "/admin/low-stock",
    label: "Stock bajo",
    icon: BarChart3,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 flex-shrink-0">
        <div className="p-4 border-b">
          <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Panel Admin
          </p>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
