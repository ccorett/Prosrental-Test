import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { requireEmployee } from "@/lib/employee-auth/session";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getEmployeeProfile } from "@/lib/employee-portal/queries";

export const metadata = { title: "My Profile" };

export default async function EmployeeProfilePage() {
  const employee = await requireEmployee();
  await ensureModulePage(employee, "PROFILE");
  const profile = await getEmployeeProfile(employee.id);
  if (!profile) return null;

  return (
    <div className="space-y-8">
      <EmployeePageHeader title="My Profile" description="Your account and assigned jobs." />
      <section className="card-industrial grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Name</p>
          <p className="font-medium">{profile.fullName}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Email</p>
          <p className="font-medium">{profile.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Role</p>
          <p className="font-medium">{profile.role.label}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Department</p>
          <p className="font-medium">{profile.department ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Job title</p>
          <p className="font-medium">{profile.jobTitle ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Status</p>
          <p className="font-medium">{profile.status}</p>
        </div>
      </section>
      <section className="card-industrial p-6">
        <h2 className="text-lg font-semibold">Assigned jobs</h2>
        <ul className="mt-4 space-y-2">
          {profile.assignedJobs.map((job) => (
            <li key={job.id} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-muted">
              {job.title} — {job.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
