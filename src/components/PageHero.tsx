import Image from "next/image";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
};

export function PageHero({ eyebrow, title, description, image }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-accent to-brand-cream">
      <div
        className={
          image
            ? "container-page grid items-center gap-8 py-12 md:py-16 lg:grid-cols-2 lg:gap-14"
            : "container-page grid items-end gap-6 py-14 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(16rem,0.85fr)] lg:items-center lg:gap-16"
        }
      >
        <div>
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-brand-coral uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-heading max-w-xl text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            {title}
          </h1>
          {image ? (
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_24px_50px_-32px_rgba(1,26,62,0.55)]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>
        ) : (
          <p className="max-w-xl text-base leading-7 text-muted-foreground lg:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
