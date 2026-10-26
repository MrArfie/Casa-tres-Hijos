import { Link, createFileRoute } from "@tanstack/react-router";

import { PageIntro } from "@/components/site/site-shell";
import { photos, signPhoto } from "@/lib/photos";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Casa Tres Hijos — Private Resort in Pampanga" },
      {
        name: "description",
        content:
          "Casa Tres Hijos is a private resort on Daffodil Street, Pampanga, with a turquoise pool and an A-frame villa rented to one group at a time.",
      },
    ],
  }),
  component: AboutPage,
});

const rooms = photos.filter((photo) =>
  ["bedroom-trundle", "bedroom-pair", "bedroom-single", "lounge", "aframe-pool-view"].includes(photo.id),
);

function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About Casa Tres Hijos"
        title="A private retreat on Daffodil Street."
        lede="Your private escape. Your unforgettable moments. The pool, the A-frame, the lounge, and the kitchen are kept for one group — family gatherings, barkada bonding, and celebrations."
      />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <img
          src={signPhoto.src}
          alt={signPhoto.alt}
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-luxe"
        />
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Casa Tres Hijos is in Pampanga. Guests have the turquoise pool, the A-frame villa, the
            lounge and loft, the dining table, and both kitchens.
          </p>
          <p>
            The resort is exclusive. Another booking does not share the property with you. Day tour
            and overnight rates are on the <Link to="/packages" className="font-semibold text-charcoal">packages page</Link>.
          </p>
          <Link
            to="/book"
            className="inline-flex h-11 items-center rounded-full bg-gold px-6 text-sm font-semibold text-charcoal"
          >
            Book your stay
          </Link>
        </div>
      </section>
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-4xl font-medium text-charcoal">Inside the villa</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((photo) => (
              <figure key={photo.id} className="overflow-hidden rounded-3xl bg-background shadow-card">
                <img src={photo.src} alt={photo.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                <figcaption className="px-4 py-3 text-sm font-medium">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
