import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { requireCustomer } from "@/lib/auth/session";
import { formatPortalDate } from "@/lib/portal/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const sessionCustomer = await requireCustomer();
  const customer = await prisma.customer.findUniqueOrThrow({
    where: { id: sessionCustomer.id },
  });

  return (
    <div>
      <PortalPageHeader
        title="Account"
        description="Your profile details and account status."
      />
      <dl className="card-industrial grid gap-6 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">Full name</dt>
          <dd className="mt-1 font-medium text-foreground">{customer.fullName}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Email</dt>
          <dd className="mt-1 font-medium text-foreground">{customer.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Phone</dt>
          <dd className="mt-1 font-medium text-foreground">{customer.phone ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Company</dt>
          <dd className="mt-1 font-medium text-foreground">{customer.companyName ?? "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm text-muted">Address</dt>
          <dd className="mt-1 font-medium text-foreground">{customer.address ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Status</dt>
          <dd className="mt-2">
            <StatusChip status={customer.status} />
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Role</dt>
          <dd className="mt-2">
            <StatusChip status={customer.role} />
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Member since</dt>
          <dd className="mt-1 font-medium text-foreground">
            {formatPortalDate(customer.createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
