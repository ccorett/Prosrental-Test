"use client";

import { useTransition } from "react";
import { acceptQuote } from "@/lib/portal/actions";
import { Button } from "@/components/ui/Button";

type AcceptQuoteButtonProps = {
  quoteId: string;
};

export function AcceptQuoteButton({ quoteId }: AcceptQuoteButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => void acceptQuote(quoteId))}
    >
      {pending ? "Accepting..." : "Accept Quote"}
    </Button>
  );
}
