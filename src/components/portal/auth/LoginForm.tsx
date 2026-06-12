"use client";

import { useActionState } from "react";
import { loginCustomer, type AuthResult } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";

const INPUT =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(
    loginCustomer,
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
        <span className="text-sm font-medium text-foreground">Email</span>
        <input type="email" name="email" required className={INPUT} />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Password</span>
        <input type="password" name="password" required className={INPUT} />
      </label>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
