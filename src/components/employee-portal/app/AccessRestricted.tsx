import Link from "next/link";

export function AccessRestricted({ message }: { message?: string }) {
  return (
    <div className="card-industrial p-8 text-center">
      <h2 className="text-lg font-semibold text-foreground">Access restricted</h2>
      <p className="mt-2 text-sm text-muted">
        {message ??
          "Your role does not have permission to view or perform this action."}
      </p>
      <Link
        href="/employee-portal/dashboard"
        className="mt-6 inline-flex text-sm font-semibold text-accent hover:text-accent-hover"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
