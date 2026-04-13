"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  Settings,
  LogOut,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Requests", icon: ClipboardList },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    document.cookie = "mock_user_id=;path=/;max-age=0";
    router.push("/login");
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 pt-7 pb-8">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl gradient-indigo flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-[15px] text-white block leading-tight">
              KP Tech
            </span>
            <span className="text-[11px] text-sidebar-foreground/40 font-medium">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/25">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-primary/15 text-primary shadow-sm shadow-primary/10"
                  : "text-sidebar-foreground/50 hover:bg-white/5 hover:text-sidebar-foreground/80"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${active ? "text-primary" : ""}`} />
              {item.label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-3 mx-3 mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center text-xs font-bold text-white shadow-md shadow-primary/20">
              {initials}
            </div>
            <div>
              <span className="text-sm text-white font-semibold block leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-sidebar-foreground/35">
                Administrator
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-sidebar-foreground/30 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 glass border-b border-white/[0.06]">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-indigo flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-white">KP Tech</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-[260px] bg-sidebar border-r border-white/[0.06] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
