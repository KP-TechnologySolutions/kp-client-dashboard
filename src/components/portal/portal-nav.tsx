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

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/portal" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight">
                KP Technology
              </span>
              <span className="text-xs text-muted-foreground">{orgName}</span>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/5 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{userName}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t flex items-center justify-around py-2 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
