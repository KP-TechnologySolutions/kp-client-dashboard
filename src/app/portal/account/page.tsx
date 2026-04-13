import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Mail } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOrganizationById } from "@/lib/queries";

export default async function PortalAccountPage() {
  const user = await getCurrentUser();
  if (!user || !user.organization_id) redirect("/login");

  const org = await getOrganizationById(user.organization_id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Account</h1>
        <p className="text-muted-foreground mt-1">Your profile and notification preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-white"><User className="w-4 h-4" />Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-indigo flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary/20">
              {user.full_name?.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div>
              <p className="font-semibold text-lg text-white">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {org && <p className="text-sm text-muted-foreground">{org.name}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-white"><Bell className="w-4 h-4" />Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Status updates", "New comments", "Request completed"].map((label) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-muted-foreground">Email when {label.toLowerCase()}</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20">On</Badge>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2">Email notification settings will be configurable when the email system is connected.</p>
        </CardContent>
      </Card>
    </div>
  );
}
