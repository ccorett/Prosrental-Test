type PortalPageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PortalPageHeader({
  title,
  description,
  action,
}: PortalPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}
