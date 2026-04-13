import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Bell, Tags } from "lucide-react";
import { ADMIN_TEAM } from "@/lib/constants";
import { CATEGORY_CONFIG } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your dashboard configuration
        </p>
      </div>

      {/* Team */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ADMIN_TEAM.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {member.name[0]}
                </div>
                <span className="text-sm font-medium">{member.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Admin
              </Badge>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2">
            Team management will be available when Supabase Auth is connected.
          </p>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tags className="w-4 h-4" />
            Request Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <div
                key={key}
                className="flex items-center gap-2 p-2.5 rounded-lg border text-sm"
              >
                {config.label}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-3">
            Category customization coming in a future update.
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">New request alerts</p>
              <p className="text-xs text-muted-foreground">
                Email when a client submits a new request
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Stale request reminders</p>
              <p className="text-xs text-muted-foreground">
                Daily digest of requests sitting for 3+ days
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Email notifications will be configured when Resend is connected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
