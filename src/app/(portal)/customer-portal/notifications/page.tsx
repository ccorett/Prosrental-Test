import { MarkReadButton } from "@/components/portal/app/MarkReadButton";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { requireCustomer } from "@/lib/auth/session";
import { formatEnumLabel } from "@/lib/portal/labels";
import { formatPortalDate } from "@/lib/portal/format";
import { getCustomerNotifications } from "@/lib/portal/queries";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const customer = await requireCustomer();
  const notifications = await getCustomerNotifications(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="Notifications"
        description="Rental reminders, return reminders, invoice reminders, and account notices."
      />
      <ul className="space-y-3">
        {notifications.map((item) => (
          <li key={item.id} className="card-industrial p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.message}</p>
                <p className="mt-2 text-xs text-muted">
                  {formatEnumLabel(item.notificationType)} · {formatPortalDate(item.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusChip status={item.readStatus} />
                {item.readStatus === "UNREAD" && (
                  <MarkReadButton notificationId={item.id} />
                )}
              </div>
            </div>
          </li>
        ))}
        {notifications.length === 0 && (
          <li className="card-industrial p-8 text-center text-sm text-muted">
            No notifications yet.
          </li>
        )}
      </ul>
    </div>
  );
}
