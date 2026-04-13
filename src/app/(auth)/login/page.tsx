"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers } from "lucide-react";

const MOCK_ACCOUNTS = [
  { id: "admin-hal", label: "Hal (Admin)", email: "hal@kptechnology.com" },
  { id: "admin-shawn", label: "Shawn (Admin)", email: "shawn@kptechnology.com" },
  { id: "client-mike", label: "Mike — 56 Kitchen", email: "mike@56kitchen.com" },
  { id: "client-sarah", label: "Sarah — Elle", email: "sarah@ellesalon.com" },
  { id: "client-james", label: "James — 56 Social", email: "james@56social.com" },
  { id: "client-tom", label: "Tom — Lowcountry Septic", email: "tom@lowcountryseptic.com" },
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-2">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            KP Technology Solutions
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your client portal
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardHeader>
        </Card>

        {/* Dev Quick Login */}
        <Card className="border-dashed border-amber-300 bg-amber-50/50">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-medium text-amber-700 mb-3 uppercase tracking-wider">
              Development Quick Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_ACCOUNTS.map((account) => (
                <Button
                  key={account.id}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 justify-start"
                  onClick={() => loginAs(account.id)}
                  disabled={loading}
                >
                  {account.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
