import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CategoryLabel } from "@/components/shared/category-label";
import { EmptyState } from "@/components/shared/empty-state";
import { PlusCircle, ClipboardList } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getRequestsForUserOrgs } from "@/lib/queries";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function PortalRequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const allRequests = await getRequestsForUserOrgs(user.id);
  const active = allRequests.filter((r: any) => r.status !== "complete" && r.status !== "rejected");
  const closed = allRequests.filter((r: any) => r.status === "complete" || r.status === "rejected");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Requests</h1>
          <p className="text-muted-foreground mt-1">{allRequests.length} total request{allRequests.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/portal/requests/new" className={buttonVariants() + " shadow-xl shadow-primary/30"}>
          <PlusCircle className="w-4 h-4 mr-2" />New Request
        </Link>
      </div>

      {allRequests.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No requests yet" description="Submit your first request and we'll get working on it."
          action={<Link href="/portal/requests/new" className={buttonVariants()}>Submit a Request</Link>} />
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active ({active.length})</h2>
              <div className="space-y-2">
                {active.map((req: any) => <RequestCard key={req.id} req={req} />)}
              </div>
            </div>
          )}
          {closed.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed ({closed.length})</h2>
              <div className="space-y-2">
                {closed.map((req: any) => <RequestCard key={req.id} req={req} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RequestCard({ req }: { req: any }) {
  return (
    <Link href={`/portal/requests/${req.id}`}>
      <Card className="hover:border-primary/20 transition-all cursor-pointer group">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs text-primary/60">KP-{String(req.request_number).padStart(4, "0")}</span>
                <StatusBadge status={req.status} />
                <PriorityBadge priority={req.priority} />
              </div>
              <h3 className="text-sm font-medium text-white/90 mb-1 group-hover:text-white transition-colors">{req.title}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {req.organization?.name && <span className="text-primary/50">{req.organization.name}</span>}
                <span>{formatDate(req.created_at)}</span>
                <CategoryLabel category={req.category} />
                {req.assigned_to && <span>Assigned to {req.assigned_to}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
