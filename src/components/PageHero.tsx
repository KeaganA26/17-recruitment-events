type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-accent to-brand-cream">
      <div className="container-page py-14 md:py-20">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-brand-coral uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading max-w-3xl text-4xl font-extrabold md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
