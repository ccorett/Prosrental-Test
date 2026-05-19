import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/pro-rentals-logo.png";

const SIZE_MAP = {
  section: {
    shell: "h-[3.75rem] w-[5.75rem] sm:h-20 sm:w-[7.25rem]",
    width: 232,
    height: 160,
  },
  hero: {
    shell: "h-[4.5rem] w-[7rem] sm:h-24 sm:w-[8.75rem] lg:h-28 lg:w-40",
    width: 320,
    height: 224,
  },
} as const;

export type LogoSize = keyof typeof SIZE_MAP;

type LogoProps = {
  size?: LogoSize;
  priority?: boolean;
  className?: string;
};

export function Logo({ size = "section", priority = false, className }: LogoProps) {
  const dims = SIZE_MAP[size];

  return (
    <span
      className={cn(
        "logo-shell inline-flex shrink-0 items-center justify-center",
        dims.shell,
        className
      )}
    >
      <Image
        src={LOGO_SRC}
        alt="Pro Rentals — Built for Performance"
        width={dims.width}
        height={dims.height}
        priority={priority}
        className="h-full w-full object-contain object-center"
        sizes="(max-width: 640px) 7rem, (max-width: 1024px) 8.75rem, 10rem"
      />
    </span>
  );
}
