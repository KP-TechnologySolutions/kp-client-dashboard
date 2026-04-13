import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import {
  organizations,
  requests,
  profiles,
  getProfile,
} from "@/lib/mock-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = organizations.find((o) => o.slug === slug);

  if (!org) {
    notFound();
  }

  const orgRequests = requests
    .filter((r) => r.organization_id === org.id)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const orgUsers = profiles.filter((p) => p.organization_id === org.id);

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All Clients
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{org.name}</h1>
          <p className="text-muted-foreground text-sm">
            Client since{" "}
            {new Date(org.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {org.primary_contact_email}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              {org.primary_contact_phone}
            </div>
            {org.website_url && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-primary truncate">
                  {org.website_url}
                </span>
              </div>
            )}
            {org.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Internal Notes
                  </p>
                  <p className="text-sm text-muted-foreground">{org.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {orgUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{orgRequests.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-amber-50">
                <p className="text-2xl font-bold text-amber-700">
                  {
                    orgRequests.filter(
                      (r) =>
                        r.status !== "complete" && r.status !== "rejected"
                    ).length
                  }
                </p>
                <p className="text-xs text-amber-600">Active</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-emerald-50">
                <p className="text-2xl font-bold text-emerald-700">
                  {orgRequests.filter((r) => r.status === "complete").length}
                </p>
                <p className="text-xs text-emerald-600">Complete</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-blue-50">
                <p className="text-2xl font-bold text-blue-700">
                  {
                    orgRequests.filter((r) => r.status === "submitted").length
                  }
                </p>
                <p className="text-xs text-blue-600">New</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Requests ({orgRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {orgRequests.map((req) => {
              const assignee = req.assigned_to
                ? getProfile(req.assigned_to)
                : null;
              return (
                <Link
                  key={req.id}
                  href={`/admin/requests/${req.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        KP-{String(req.request_number).padStart(4, "0")}
                      </span>
                      <span className="text-sm font-medium truncate">
                        {req.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(req.created_at)}
                      </span>
                      {assignee && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">
                            {assignee.full_name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
