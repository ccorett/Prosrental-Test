import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DemoAccountsHelper } from "@/components/employee-portal/auth/DemoAccountsHelper";
import { EmployeeLoginForm } from "@/components/employee-portal/auth/EmployeeLoginForm";
import { Container } from "@/components/ui/Container";
import { getSessionEmployee } from "@/lib/employee-auth/session";

export const metadata: Metadata = {
  title: "Employee Login",
};

export const dynamic = "force-dynamic";

export default async function EmployeeLoginPage() {
  const employee = await getSessionEmployee();
  if (employee) {
    redirect("/employee-portal/dashboard");
  }

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-md">
        <p className="label-caps text-secondary">Employee Portal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Staff Sign In</h1>
        <p className="mt-2 text-sm text-muted">
          Authorized Pro Rentals employees only.
        </p>
        <div className="card-industrial mt-8 p-6 sm:p-8">
          <EmployeeLoginForm />
          <DemoAccountsHelper />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/employee-portal" className="font-semibold text-secondary hover:text-secondary-hover">
            Back to Employee Portal
          </Link>
        </p>
      </Container>
    </section>
  );
}
