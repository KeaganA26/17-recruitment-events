import type { LucideIcon } from "lucide-react";

type CategoryCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function CategoryCard({ title, description, icon: Icon }: CategoryCardProps) {
  return (
    <article className="group rounded-2xl border border-border bg-brand-paper p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="grid size-11 place-items-center rounded-xl bg-brand-ink text-brand-gold">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="font-heading mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  );
}
