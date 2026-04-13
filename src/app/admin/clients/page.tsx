import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { organizations, requests } from "@/lib/mock-data";

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground mt-1">
          {organizations.length} active client organizations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {organizations.map((org) => {
          const orgRequests = requests.filter(
            (r) => r.organization_id === org.id
          );
          const active = orgRequests.filter(
            (r) => r.status !== "complete" && r.status !== "rejected"
          ).length;
          const complete = orgRequests.filter(
            (r) => r.status === "complete"
          ).length;

          return (
            <Link key={org.id} href={`/admin/clients/${org.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{org.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {org.primary_contact_name}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    {org.website_url && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {org.website_url.replace(/https?:\/\//, "")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{orgRequests.length} total</span>
                    </div>
                    {active > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                      >
                        {active} active
                      </Badge>
                    )}
                    {complete > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                      >
                        {complete} complete
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
