import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/portal/auth/RegisterForm";
import { Container } from "@/components/ui/Container";
import { getSessionCustomer } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Portal Register",
};

export default async function PortalRegisterPage() {
  const customer = await getSessionCustomer();
  if (customer) {
    redirect("/customer-portal/dashboard");
  }

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-lg">
        <p className="label-caps text-accent">Customer Portal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Create Account</h1>
        <p className="mt-2 text-sm text-muted">
          Register to manage equipment rentals online with Pro Rentals.
        </p>
        <div className="card-industrial mt-8 p-6 sm:p-8">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Already registered?{" "}
          <Link href="/customer-portal/login" className="font-semibold text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </p>
      </Container>
    </section>
  );
}
