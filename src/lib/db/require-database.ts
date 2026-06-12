/**
 * Customer Portal and auth persistence require Neon PostgreSQL via DATABASE_URL.
 * Public marketing pages may use static fallbacks; portal routes must not.
 */
export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not configured. Customer Portal requires Neon PostgreSQL."
    );
  }
  return url;
}
