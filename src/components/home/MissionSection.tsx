import Image from "next/image";
import { Container } from "@/components/ui/Container";

const LOGO_SRC = "/images/pro-rentals-logo.png";

export function MissionSection() {
  return (
    <section className="py-16 lg:py-[5rem]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.5rem]">
              Our Mission:{" "}
              <span className="text-secondary">Absolute Reliability.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              We exist to eliminate downtime. Every piece of equipment in our
              fleet undergoes a 128-point inspection protocol designed by former
              heavy-machinery engineers.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              When your project timeline is non-negotiable, our logistics network
              and maintenance standards ensure your crew never waits on gear.
            </p>
          </div>

          <div className="relative">
            <div
              className="card-industrial relative aspect-[4/3] w-full overflow-hidden lg:aspect-[5/4]"
              role="img"
              aria-label="Pro Rentals brand logo"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2838] via-[#121c28] to-[#080e14]" />
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-12deg, transparent, transparent 14px, rgba(0,198,255,0.03) 14px, rgba(0,198,255,0.03) 15px)",
                }}
              />

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[64px] sm:h-64 sm:w-64" />
              <div className="pointer-events-none absolute left-[58%] top-[52%] z-0 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-[56px] sm:h-56 sm:w-56" />

              <div className="absolute inset-0 z-10 flex items-center justify-center p-6 sm:p-8">
                <Image
                  src={LOGO_SRC}
                  alt="Pro Rentals — Built for Performance"
                  width={520}
                  height={364}
                  className="h-auto max-h-[min(220px,42vw)] w-auto max-w-[70%] object-contain object-center sm:max-h-[min(260px,38vh)]"
                  sizes="(max-width: 1024px) 70vw, 360px"
                />
              </div>
            </div>

            <aside className="absolute bottom-6 left-6 z-20 max-w-xs rounded-xl border border-border bg-background/90 p-5 backdrop-blur-md sm:bottom-8 sm:left-8">
              <p className="label-caps text-accent">Uptime Guarantee</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                99.8%
              </p>
              <p className="mt-1 font-mono text-sm text-muted">Field Performance</p>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
