"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers, ArrowRight, Shield } from "lucide-react";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[440px] space-y-8"
      >
        {/* Brand */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-indigo shadow-xl shadow-primary/30 mb-1"
          >
            <Layers className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              KP Technology
            </h1>
            <p className="text-muted-foreground mt-1">
              Client Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass border-white/[0.08]">
            <CardContent className="pt-8 pb-8 px-7">
              <form onSubmit={handleEmailLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-white/80">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-white/80">
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
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-sm shadow-xl shadow-primary/30"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dev Quick Login */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Dev Quick Login
                </span>
              </div>

              {/* Admin */}
              <p className="text-[10px] font-semibold text-amber-500/60 uppercase tracking-widest mb-2">
                Admin
              </p>
              <button
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl border border-amber-500/15 bg-amber-500/5 hover:bg-amber-500/10 text-left transition-all cursor-pointer mb-3"
                onClick={() => loginAs("admin-kp")}
                disabled={loading}
              >
                <div className="w-8 h-8 rounded-lg gradient-indigo flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-md shadow-primary/20">
                  KP
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">KP Admin</p>
                  <p className="text-[11px] text-muted-foreground">Hal &amp; Shawn</p>
                </div>
              </button>

              {/* Clients */}
              <p className="text-[10px] font-semibold text-amber-500/60 uppercase tracking-widest mb-2">
                Clients
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {MOCK_ACCOUNTS.filter((a) => a.id.startsWith("client-")).map((account) => (
                  <button
                    key={account.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] text-left transition-all cursor-pointer"
                    onClick={() => loginAs(account.id)}
                    disabled={loading}
                  >
                    <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {account.label[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white/90 truncate">
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
        </motion.div>
      </motion.div>
    </div>
  );
}
