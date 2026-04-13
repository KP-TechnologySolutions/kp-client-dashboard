"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CategoryLabel } from "@/components/shared/category-label";
import { EmptyState } from "@/components/shared/empty-state";
import { Search, ClipboardList, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_TEAM } from "@/lib/constants";

function formatAge(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [reqRes, orgRes] = await Promise.all([
        supabase.from("requests").select("*, organization:organizations(id, name, slug)").order("created_at", { ascending: false }),
        supabase.from("organizations").select("id, name").eq("active", true).order("name"),
      ]);
      setRequests(reqRes.data ?? []);
      setOrgs(orgRes.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = requests.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !`kp-${String(r.request_number).padStart(4, "0")}`.includes(q) && !r.organization?.name?.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (orgFilter !== "all" && r.organization_id !== orgFilter) return false;
    if (assigneeFilter === "unassigned" && r.assigned_to) return false;
    if (assigneeFilter !== "all" && assigneeFilter !== "unassigned" && r.assigned_to !== assigneeFilter) return false;
    if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">All Requests</h1>
        <p className="text-muted-foreground mt-1">{requests.length} total requests across all clients</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl bg-card border border-white/[0.06] shadow-lg shadow-black/20">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search requests..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={orgFilter} onValueChange={(v) => v && setOrgFilter(v)}>
          <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {orgs.map((org) => <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={(v) => v && setAssigneeFilter(v)}>
          <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Assignee" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {ADMIN_TEAM.map((m) => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => v && setPriorityFilter(v)}>
          <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No requests found" description={requests.length === 0 ? "No requests have been submitted yet." : "Try adjusting your filters."} />
      ) : (
        <div className="border border-white/[0.06] rounded-2xl overflow-hidden shadow-lg shadow-black/20 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/[0.02] hover:bg-white/[0.02] border-white/[0.06]">
                <TableHead className="w-24 text-muted-foreground">#</TableHead>
                <TableHead className="text-muted-foreground">Request</TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">Client</TableHead>
                <TableHead className="hidden lg:table-cell text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">Priority</TableHead>
                <TableHead className="hidden lg:table-cell text-muted-foreground">Assignee</TableHead>
                <TableHead className="hidden lg:table-cell text-right text-muted-foreground">Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req) => (
                <TableRow key={req.id} className="hover:bg-white/[0.03] border-white/[0.06] transition-colors cursor-pointer group">
                  <TableCell>
                    <Link href={`/admin/requests/${req.id}`} className="font-mono text-xs text-primary/60 group-hover:text-primary transition-colors">
                      KP-{String(req.request_number).padStart(4, "0")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/requests/${req.id}`} className="font-medium text-sm text-white/80 group-hover:text-white transition-colors">
                      {req.title}
                    </Link>
                    <span className="md:hidden block text-xs text-muted-foreground mt-0.5">{req.organization?.name}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{req.organization?.name}</TableCell>
                  <TableCell className="hidden lg:table-cell"><CategoryLabel category={req.category} /></TableCell>
                  <TableCell><StatusBadge status={req.status} /></TableCell>
                  <TableCell className="hidden md:table-cell"><PriorityBadge priority={req.priority} /></TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {req.assigned_to ?? <span className="text-amber-400">Unassigned</span>}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground text-right">{formatAge(req.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
