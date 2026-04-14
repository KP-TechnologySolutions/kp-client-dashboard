"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Send, Upload, X, FileIcon, ImageIcon, Building2 } from "lucide-react";
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { createRequest } from "@/lib/actions";

interface UserOrg {
  organization_id: string;
  name: string;
}

export default function NewRequestPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("normal");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [userOrgs, setUserOrgs] = useState<UserOrg[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    async function loadOrgs() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Get all orgs this user is linked to
      const { data: orgLinks } = await supabase
        .from("user_organizations")
        .select("organization_id, organizations(name)")
        .eq("user_id", user.id);

      if (orgLinks && orgLinks.length > 0) {
        const orgs = orgLinks.map((link: any) => ({
          organization_id: link.organization_id,
          name: link.organizations?.name ?? "Unknown",
        }));
        setUserOrgs(orgs);
        // Auto-select if only one org
        if (orgs.length === 1) {
          setSelectedOrgId(orgs[0].organization_id);
        }
      } else {
        // Fallback to profile's org
        const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single();
        if (profile?.organization_id) {
          const { data: org } = await supabase.from("organizations").select("name").eq("id", profile.organization_id).single();
          setUserOrgs([{ organization_id: profile.organization_id, name: org?.name ?? "Unknown" }]);
          setSelectedOrgId(profile.organization_id);
        }
      }
    }
    loadOrgs();
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function isImage(file: File) {
    return file.type.startsWith("image/");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category || !selectedOrgId || !userId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const data = await createRequest({
        title, description, category, priority, organization_id: selectedOrgId,
      });

      // Upload files
      if (files.length > 0) {
        const supabase = createClient();
        for (const file of files) {
          const filePath = `${data.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("request-attachments")
            .upload(filePath, file);

          if (uploadError) { console.error("Upload failed:", uploadError); continue; }

          await supabase.from("request_attachments").insert({
            request_id: data.id,
            storage_path: filePath,
            file_name: file.name,
            file_size_kb: Math.round(file.size / 1024),
            mime_type: file.type,
            uploaded_by: userId,
          });
        }
      }

      toast.success("Request submitted!", {
        description: `Request #KP-${String(data.request_number).padStart(4, "0")}${files.length > 0 ? ` with ${files.length} file(s)` : ""}`,
      });
      router.push("/portal/requests");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/portal/requests" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />My Requests
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Submit a New Request</h1>
        <p className="text-muted-foreground mt-1">Tell us what you need changed on your website</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-7 pb-7 px-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Organization picker — shows when user has multiple orgs */}
            {userOrgs.length > 1 && (
              <div className="space-y-2">
                <Label className="text-white/80 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  Which website is this for? <span className="text-red-400">*</span>
                </Label>
                <Select value={selectedOrgId} onValueChange={(v) => v && setSelectedOrgId(v)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a business" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOrgs.map((org) => (
                      <SelectItem key={org.organization_id} value={org.organization_id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Show selected org for single-org users */}
            {userOrgs.length === 1 && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="w-8 h-8 rounded-lg gradient-indigo flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{userOrgs[0].name}</p>
                  <p className="text-xs text-muted-foreground">Submitting request for this business</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/80">Title <span className="text-red-400">*</span></Label>
              <Input id="title" placeholder="e.g., Update lunch menu prices" value={title} onChange={(e) => setTitle(e.target.value)} />
              <p className="text-xs text-muted-foreground">A short summary of what you need</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/80">Description <span className="text-red-400">*</span></Label>
              <Textarea id="description" placeholder="Describe what you'd like changed in detail..." className="min-h-32" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Category <span className="text-red-400">*</span></Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Priority</Label>
                <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-white/80">Attachments</Label>
              <div
                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-primary/30 transition-all cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                />
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-5 h-5 text-primary/60" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Drag and drop files here, or click to browse</p>
                <p className="text-xs text-muted-foreground/60">Images, PDFs, documents — up to 10MB each</p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 mt-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {isImage(file) ? <ImageIcon className="w-4 h-4 text-primary" /> : <FileIcon className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 text-muted-foreground hover:text-red-400" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">{files.length} file{files.length !== 1 ? "s" : ""} selected</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading || !selectedOrgId} className="flex-1 shadow-xl shadow-primary/25">
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
