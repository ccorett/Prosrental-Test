export function formatPortalDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-TT", {
    dateStyle: "medium",
  }).format(new Date(date));
}
