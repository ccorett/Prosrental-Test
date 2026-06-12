type EmployeePageHeaderProps = {
  title: string;
  description?: string;
};

export function EmployeePageHeader({ title, description }: EmployeePageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-muted">{description}</p>}
    </header>
  );
}
