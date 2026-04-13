import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { ArrowLeft, Building2, Globe, Mail, Phone, FileText } from "lucide-react";
import { getOrganizationBySlug, getRequestsForOrg, getOrgMembers } from "@/lib/queries";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const [orgRequests, orgUsers] = await Promise.all([
    getRequestsForOrg(org.id),
    getOrgMembers(org.id),
  ]);

  const active = orgRequests.filter((r: any) => r.status !== "complete" && r.status !== "rejected").length;
  const complete = orgRequests.filter((r: any) => r.status === "complete").length;
  const submitted = orgRequests.filter((r: any) => r.status === "submitted").length;

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />All Clients
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl gradient-indigo flex items-center justify-center shadow-lg shadow-primary/20">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{org.name}</h1>
          <p className="text-muted-foreground text-sm">
            Client since {new Date(org.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Contact Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {org.primary_contact_email && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-4 h-4" />{org.primary_contact_email}</div>}
            {org.primary_contact_phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-4 h-4" />{org.primary_contact_phone}</div>}
            {org.website_url && <div className="flex items-center gap-2 text-sm text-primary"><Globe className="w-4 h-4" /><span className="truncate">{org.website_url}</span></div>}
            {org.notes && (<><Separator className="bg-white/[0.06]" /><div><p className="text-xs font-medium text-muted-foreground mb-1">Internal Notes</p><p className="text-sm text-muted-foreground">{org.notes}</p></div></>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {orgUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members yet</p>
            ) : orgUsers.map((user: any) => (
              <div key={user.id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center text-[10px] font-bold text-white">
                  {user.full_name?.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Request Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-white/[0.03]"><p className="text-2xl font-bold text-white">{orgRequests.length}</p><p className="text-xs text-muted-foreground">Total</p></div>
              <div className="text-center p-2 rounded-lg bg-amber-500/10"><p className="text-2xl font-bold text-amber-400">{active}</p><p className="text-xs text-amber-400/70">Active</p></div>
              <div className="text-center p-2 rounded-lg bg-emerald-500/10"><p className="text-2xl font-bold text-emerald-400">{complete}</p><p className="text-xs text-emerald-400/70">Complete</p></div>
              <div className="text-center p-2 rounded-lg bg-blue-500/10"><p className="text-2xl font-bold text-blue-400">{submitted}</p><p className="text-xs text-blue-400/70">New</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2 text-white"><FileText className="w-4 h-4" />Requests ({orgRequests.length})</CardTitle></CardHeader>
        <CardContent>
          {orgRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No requests from this client yet.</p>
          ) : (
            <div className="space-y-2">
              {orgRequests.map((req: any) => (
                <Link key={req.id} href={`/admin/requests/${req.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary/60">KP-{String(req.request_number).padStart(4, "0")}</span>
                      <span className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">{req.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{formatDate(req.created_at)}</span>
                      {req.assigned_to && (<><span className="text-white/10">·</span><span className="text-xs text-muted-foreground">{req.assigned_to}</span></>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
