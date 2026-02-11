interface PropertyDescriptionProps {
  description: string | null;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl font-medium">About this Estate</h2>
      <p className="text-muted-foreground text-sm leading-relaxed font-sans">
        {description || 'No description provided.'}
      </p>
    </div>
  );
}
