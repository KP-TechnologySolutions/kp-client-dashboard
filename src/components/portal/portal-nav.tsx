"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  User,
  LogOut,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/requests", label: "My Requests", icon: ClipboardList },
  { href: "/portal/requests/new", label: "New Request", icon: PlusCircle },
  { href: "/portal/account", label: "Account", icon: User },
];

interface PortalNavProps {
  userName: string;
  orgName: string;
}

export function PortalNav({ userName, orgName }: PortalNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    document.cookie = "mock_user_id=;path=/;max-age=0";
    router.push("/login");
  }

  function isActive(href: string) {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 glass border-b border-white/[0.06] sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <Link href="/portal" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <Layers className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block leading-tight">
                KP Technology
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                {orgName}
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-primary/15 text-primary shadow-sm shadow-primary/10"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-indigo flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <span className="text-sm font-medium text-white/70">
              {userName}
            </span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t border-white/[0.06] flex items-center justify-around py-2 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${active ? "bg-primary/15" : ""}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
