import { PortalShell } from "@/components/portal/app/PortalShell";
import { requireCustomer } from "@/lib/access/guards";
import { requireDatabaseUrl } from "@/lib/db/require-database";

export const dynamic = "force-dynamic";

export default async function PortalAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  requireDatabaseUrl();
  const customer = await requireCustomer();
  return <PortalShell customer={customer}>{children}</PortalShell>;
}
