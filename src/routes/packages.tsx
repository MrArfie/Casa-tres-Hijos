import { Link, createFileRoute } from "@tanstack/react-router";

import { RateBoard } from "@/components/site/rate-board";
import { PageIntro } from "@/components/site/site-shell";
import { packages } from "@/lib/site";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Packages & Rates — Casa Tres Hijos Pampanga" },
      {
        name: "description",
        content:
          "Day tour and overnight stay at Casa Tres Hijos. Promo rates through December 2026: ₱6,999 Monday to Thursday, ₱7,999 Friday to Sunday.",
      },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Packages and rates"
        title="Day tour or overnight."
        lede="The whole resort is for one group. Promo rates run through December 2026."
      />
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <RateBoard />
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2">
        {packages.map((item) => (
          <article key={item.id} className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-card">
            <h2 className="text-4xl font-medium text-charcoal">{item.label}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
            <Link
              to="/book"
              search={{ stay: item.id }}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-charcoal text-sm font-semibold text-cream"
            >
              Request this package
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
