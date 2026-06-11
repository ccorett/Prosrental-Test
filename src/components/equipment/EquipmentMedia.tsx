"use client";

import { Wrench } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { cn } from "@/lib/utils";

type EquipmentMediaProps = {
  itemId: string;
  name: string;
  imageUrl: string | null;
  comingSoon: boolean;
  featured?: boolean;
  aspectClass?: string;
  className?: string;
  children?: React.ReactNode;
};

export function EquipmentMedia({
  itemId,
  name,
  imageUrl,
  comingSoon,
  featured = false,
  aspectClass = "aspect-[4/3] w-full",
  className = "",
  children,
}: EquipmentMediaProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(imageUrl) && !imageError;

  if (showImage && imageUrl) {
    return (
      <div className={cn("relative overflow-hidden", aspectClass, className)}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
        {children}
      </div>
    );
  }

  if (comingSoon) {
    return (
      <div
        className={cn(
          "relative overflow-hidden border border-border/60 bg-gradient-to-br from-surface via-surface-elevated to-canvas",
          aspectClass,
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 12px, rgba(0,198,255,0.05) 12px, rgba(0,198,255,0.05) 13px)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/80 bg-background/60 text-accent shadow-lg shadow-accent/10">
            <Wrench className="h-7 w-7" aria-hidden />
          </span>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted">
            Image Coming Soon
          </p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <PlaceholderMedia
      seed={itemId}
      label={name}
      aspectClass={aspectClass}
      className={cn("bg-surface", className)}
      icon={Wrench}
    >
      {featured && (
        <div className="absolute inset-0 flex items-end justify-center pb-6">
          <span className="rounded-full border border-accent/30 bg-background/70 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm">
            Image ready for upload
          </span>
        </div>
      )}
      {children}
    </PlaceholderMedia>
  );
}
