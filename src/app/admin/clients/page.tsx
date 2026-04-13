import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, ArrowRight, ClipboardList } from "lucide-react";
import { getOrganizations, getAllRequests } from "@/lib/queries";

export default async function AdminClientsPage() {
  const [organizations, requests] = await Promise.all([
    getOrganizations(),
    getAllRequests(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Clients</h1>
        <p className="text-muted-foreground mt-1">{organizations.length} active client organizations</p>
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl gradient-indigo flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <p className="text-sm font-medium text-white mb-1">No clients yet</p>
          <p className="text-xs text-muted-foreground">Organizations will appear here once added.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {organizations.map((org) => {
            const orgRequests = requests.filter((r: any) => r.organization_id === org.id);
            const active = orgRequests.filter((r: any) => r.status !== "complete" && r.status !== "rejected").length;
            const complete = orgRequests.filter((r: any) => r.status === "complete").length;

            return (
              <Link key={org.id} href={`/admin/clients/${org.slug}`}>
                <Card className="hover:border-primary/20 transition-all cursor-pointer h-full group">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl gradient-indigo flex items-center justify-center shadow-md shadow-primary/15 group-hover:shadow-lg group-hover:shadow-primary/25 transition-shadow">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{org.name}</h3>
                          <p className="text-xs text-muted-foreground">{org.primary_contact_name}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    {org.website_url && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                        <Globe className="w-3 h-3" />
                        {org.website_url.replace(/https?:\/\//, "")}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{orgRequests.length} total</span>
                      </div>
                      {active > 0 && (
                        <Badge variant="outline" className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-xs">{active} active</Badge>
                      )}
                      {complete > 0 && (
                        <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs">{complete} complete</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
