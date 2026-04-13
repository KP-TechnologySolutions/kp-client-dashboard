import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Mail } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOrganization } from "@/lib/mock-data";

export default async function PortalAccountPage() {
  const user = await getCurrentUser();
  if (!user || !user.organization_id) redirect("/login");

  const org = getOrganization(user.organization_id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground mt-1">
          Your profile and notification preferences
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-semibold text-lg">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {org && (
                <p className="text-sm text-muted-foreground">{org.name}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status updates</p>
                <p className="text-xs text-muted-foreground">
                  Email when your request status changes
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              On
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">New comments</p>
                <p className="text-xs text-muted-foreground">
                  Email when someone comments on your request
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              On
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Request completed</p>
                <p className="text-xs text-muted-foreground">
                  Email when your request is marked as complete
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              On
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Email notification settings will be configurable when the email
            system is connected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
