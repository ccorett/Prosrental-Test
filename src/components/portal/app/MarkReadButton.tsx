"use client";

import { useTransition } from "react";
import { markNotificationRead } from "@/lib/portal/actions";

type MarkReadButtonProps = {
  notificationId: string;
};

export function MarkReadButton({ notificationId }: MarkReadButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => void markNotificationRead(notificationId))}
      className="text-xs font-semibold text-accent hover:text-accent-hover disabled:opacity-50"
    >
      {pending ? "..." : "Mark read"}
    </button>
  );
}
