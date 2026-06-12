import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { requireEmployee } from "@/lib/employee-auth/session";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getEmployeeNotifications } from "@/lib/employee-portal/queries";

export const metadata = { title: "Notifications" };

export default async function EmployeeNotificationsPage() {
  const employee = await requireEmployee();
  await ensureModulePage(employee, "NOTIFICATIONS");
  const notifications = await getEmployeeNotifications(employee.id);

  return (
    <div>
      <EmployeePageHeader title="Notifications" description="Your operational alerts and updates." />
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li key={n.id} className="card-industrial p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-foreground">{n.title}</p>
              <span className="text-xs text-muted">{n.readStatus}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{n.message}</p>
          </li>
        ))}
        {notifications.length === 0 && <p className="text-sm text-muted">No notifications.</p>}
      </ul>
    </div>
  );
}
