import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Shield, Truck, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getSessionEmployee } from "@/lib/employee-auth/session";
export const metadata: Metadata = {
  title: "Employee Portal",
  description: "Pro Rentals internal employee operations portal.",
};

export const dynamic = "force-dynamic";

const MODULES = [
  { icon: Truck, title: "Fleet & Delivery", text: "Schedules, dispatches, and route coordination." },
  { icon: Wrench, title: "Maintenance", text: "Repairs, inspections, and service schedules." },
  { icon: Shield, title: "Safety & Compliance", text: "Incidents, audits, and compliance tracking." },
  { icon: Building2, title: "Admin Management", text: "Roles, permissions, and employee accounts." },
];

export default async function EmployeePortalLandingPage() {
  const employee = await getSessionEmployee();
  if (employee) {
    redirect("/employee-portal/dashboard");
  }

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <p className="label-caps text-secondary">Employee Portal</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Internal Operations Platform
          </h1>
          <p className="mt-4 text-muted">
            Secure access for Pro Rentals staff — equipment, fleet, maintenance, HR,
            safety, and administration.
          </p>
          <Link
            href="/employee-portal/login"
            className="mt-8 inline-flex rounded-2xl bg-secondary px-8 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-secondary-hover"
          >
            Employee Sign In
          </Link>
        </header>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="card-industrial p-6">
                <Icon className="h-8 w-8 text-secondary" />
                <h2 className="mt-4 font-semibold text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </article>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-muted">
          Customer accounts use the{" "}
          <Link href="/customer-portal" className="font-semibold text-accent hover:text-accent-hover">
            Customer Portal
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
