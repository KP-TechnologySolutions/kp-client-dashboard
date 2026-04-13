import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getOrganization } from "@/lib/mock-data";
import { PortalNav } from "@/components/portal/portal-nav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const org = user.organization_id
    ? getOrganization(user.organization_id)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <PortalNav
        userName={user.full_name}
        orgName={org?.name ?? "KP Technology"}
      />
      <main className="pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
