"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers, ArrowRight, Shield, Users } from "lucide-react";

const MOCK_ACCOUNTS = [
  { id: "admin-kp", label: "KP Admin", role: "Admin", email: "admin@kptechnology.com" },
  { id: "client-mike", label: "Mike Chen", role: "56 Kitchen", email: "mike@56kitchen.com" },
  { id: "client-sarah", label: "Sarah Williams", role: "Elle", email: "sarah@ellesalon.com" },
  { id: "client-james", label: "James Park", role: "56 Social", email: "james@56social.com" },
  { id: "client-tom", label: "Tom Bradley", role: "Lowcountry Septic", email: "tom@lowcountryseptic.com" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function loginAs(userId: string) {
    setLoading(true);
    document.cookie = `mock_user_id=${userId};path=/;max-age=86400`;
    const isAdmin = userId.startsWith("admin-");
    router.push(isAdmin ? "/admin" : "/portal");
  }

  function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    const account = MOCK_ACCOUNTS.find((a) => a.email === email);
    if (account) {
      loginAs(account.id);
    }
  }

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 mb-1">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              KP Technology
            </h1>
            <p className="text-muted-foreground mt-1">
              Client Portal
            </p>
          </div>
        </div>

        {/* Login Card — Glassmorphism */}
        <Card className="glass-card shadow-xl shadow-primary/5 border-white/40">
          <CardContent className="pt-8 pb-8 px-7">
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 bg-white/80 border-border/60 focus:bg-white transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11 bg-white/80 border-border/60 focus:bg-white transition-colors"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Dev Quick Login */}
        <Card className="border-dashed border-amber-300/70 bg-amber-50/40 backdrop-blur-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-md bg-amber-200/70 flex items-center justify-center">
                <Shield className="w-3 h-3 text-amber-700" />
              </div>
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Dev Quick Login
              </span>
            </div>

            {/* Admin account */}
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-2">
              Admin
            </p>
            <button
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg border border-amber-200/80 bg-white/60 hover:bg-white hover:shadow-sm text-left transition-all cursor-pointer mb-3"
              onClick={() => loginAs("admin-kp")}
              disabled={loading}
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                KP
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">
                  KP Admin
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Hal &amp; Shawn
                </p>
              </div>
            </button>

            {/* Client accounts */}
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-2">
              Clients
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {MOCK_ACCOUNTS.filter((a) => a.id.startsWith("client-")).map((account) => (
                <button
                  key={account.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-200/80 bg-white/60 hover:bg-white hover:shadow-sm text-left transition-all cursor-pointer"
                  onClick={() => loginAs(account.id)}
                  disabled={loading}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 shrink-0">
                    {account.label[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {account.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {account.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
