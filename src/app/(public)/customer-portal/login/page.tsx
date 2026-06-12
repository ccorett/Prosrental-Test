import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CustomerDemoHelper } from "@/components/portal/auth/CustomerDemoHelper";
import { LoginForm } from "@/components/portal/auth/LoginForm";
import { Container } from "@/components/ui/Container";
import { getSessionCustomer } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Portal Login",
};

export const dynamic = "force-dynamic";

export default async function PortalLoginPage() {
  const customer = await getSessionCustomer();
  if (customer) {
    redirect("/customer-portal/dashboard");
  }

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-md">
        <p className="label-caps text-accent">Customer Portal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Sign In</h1>
        <p className="mt-2 text-sm text-muted">
          Access your rentals, bookings, quotes, invoices, and documents.
        </p>
        <div className="card-industrial mt-8 p-6 sm:p-8">
          <LoginForm />
          <CustomerDemoHelper />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/customer-portal/register" className="font-semibold text-accent hover:text-accent-hover">
            Register here
          </Link>
        </p>
      </Container>
    </section>
  );
}
