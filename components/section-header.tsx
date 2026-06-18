interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-2">
      <span className="inline-block px-3 py-1 text-xs font-medium text-primary border border-primary/30 rounded-full mb-4 bg-primary/5">
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">{title}</h2>
      {description && (
        <p className="text-muted-foreground max-w-xl mx-auto text-base">{description}</p>
      )}
    </div>
  );
}
