"use client";

import { useActionState } from "react";
import { registerCustomer, type AuthResult } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";

const INPUT =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(
    registerCustomer,
    {}
  );

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <label className="block">
        <span className="text-sm font-medium text-foreground">Full name</span>
        <input type="text" name="fullName" required className={INPUT} />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Email</span>
        <input type="email" name="email" required className={INPUT} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Phone</span>
          <input type="tel" name="phone" className={INPUT} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Company</span>
          <input type="text" name="companyName" className={INPUT} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Address</span>
        <input type="text" name="address" className={INPUT} />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Password</span>
        <input type="password" name="password" required minLength={8} className={INPUT} />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Confirm password</span>
        <input type="password" name="confirmPassword" required className={INPUT} />
      </label>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
