interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="space-y-2 mb-6 text-center">
      <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm font-sans">{subtitle}</p>
    </div>
  );
}
