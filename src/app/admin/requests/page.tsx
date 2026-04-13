"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CategoryLabel } from "@/components/shared/category-label";
import { EmptyState } from "@/components/shared/empty-state";
import { Search, ClipboardList } from "lucide-react";
import {
  requests,
  organizations,
  getProfile,
  getOrganization,
} from "@/lib/mock-data";
import { ADMIN_TEAM } from "@/lib/constants";
import type { RequestStatus, RequestPriority } from "@/lib/types";

function formatAge(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export default function AdminRequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orgFilter, setOrgFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filtered = requests
    .filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        const org = getOrganization(r.organization_id);
        if (
          !r.title.toLowerCase().includes(q) &&
          !`kp-${String(r.request_number).padStart(4, "0")}`.includes(q) &&
          !org?.name.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (orgFilter !== "all" && r.organization_id !== orgFilter) return false;
      if (assigneeFilter === "unassigned" && r.assigned_to !== null)
        return false;
      if (
        assigneeFilter !== "all" &&
        assigneeFilter !== "unassigned" &&
        r.assigned_to !== assigneeFilter
      )
        return false;
      if (priorityFilter !== "all" && r.priority !== priorityFilter)
        return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Requests</h1>
        <p className="text-muted-foreground mt-1">
          {requests.length} total requests across all clients
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl bg-card border border-border/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-9 bg-background/80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
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
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={(v) => v && setAssigneeFilter(v)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {ADMIN_TEAM.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => v && setPriorityFilter(v)}>
          <SelectTrigger className="w-full md:w-36">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No requests found"
          description="Try adjusting your filters."
        />
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-24">#</TableHead>
                <TableHead>Request</TableHead>
                <TableHead className="hidden md:table-cell">Client</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Category
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Priority
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Assignee
                </TableHead>
                <TableHead className="hidden lg:table-cell text-right">
                  Age
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req) => {
                const org = getOrganization(req.organization_id);
                const assignee = req.assigned_to
                  ? getProfile(req.assigned_to)
                  : null;
                return (
                  <TableRow key={req.id} className="hover:bg-primary/[0.02] transition-colors cursor-pointer group">
                    <TableCell>
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors"
                      >
                        KP-{String(req.request_number).padStart(4, "0")}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="font-medium text-sm group-hover:text-primary transition-colors"
                      >
                        {req.title}
                      </Link>
                      <span className="md:hidden block text-xs text-muted-foreground mt-0.5">
                        {org?.name}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {org?.name}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <CategoryLabel category={req.category} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <PriorityBadge priority={req.priority} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {assignee?.full_name ?? (
                        <span className="text-amber-600 font-medium">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground text-right">
                      {formatAge(req.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
