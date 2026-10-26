import { createFileRoute } from "@tanstack/react-router";

import { AmenityList } from "@/components/site/amenity-list";
import { PageIntro } from "@/components/site/site-shell";
import { amenityHighlights } from "@/lib/site";
import { photos } from "@/lib/photos";

export const Route = createFileRoute("/amenities")({
  head: () => ({
    meta: [
      { title: "Amenities — Casa Tres Hijos Private Resort" },
      {
        name: "description",
        content:
          "Pool, outdoor kitchen and grill, air-conditioned rooms, free Wi-Fi, Netflix, videoke, and towels at Casa Tres Hijos in Pampanga.",
      },
    ],
  }),
  component: AmenitiesPage,
});

const bathroom = photos.find((photo) => photo.id === "bathroom");

function AmenitiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Amenities"
        title="Everything included with the stay."
        lede="Swimming pool, outdoor kitchen and grill, comfortable air-conditioned rooms, free Wi-Fi, Netflix, and videoke. Towels are included with an overnight stay. Day tour guests may use the loft."
      />
      <section className="mx-auto max-w-6xl px-5 py-16">
        <AmenityList />
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-16">
        <h2 className="text-4xl font-medium text-charcoal">The spaces</h2>
        {amenityHighlights.map((item, index) => (
          <article key={item.title} className="grid items-center gap-6 overflow-hidden rounded-3xl bg-card shadow-card md:grid-cols-2">
            <img
              src={item.photo.src}
              alt={item.photo.alt}
              loading="lazy"
              className={`aspect-[5/4] h-full w-full object-cover ${index % 2 === 1 ? "md:order-2" : ""}`}
            />
            <div className="px-6 py-8 md:px-10">
              <h2 className="text-4xl font-medium text-charcoal">{item.title}</h2>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </article>
        ))}
        {bathroom ? (
          <article className="grid items-center gap-6 overflow-hidden rounded-3xl bg-card shadow-card md:grid-cols-2">
            <img src={bathroom.src} alt={bathroom.alt} loading="lazy" className="aspect-[5/4] h-full w-full object-cover md:order-2" />
            <div className="px-6 py-8 md:px-10">
              <h2 className="text-4xl font-medium text-charcoal">Bathroom</h2>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                A bathroom with a rain shower, toilet, and marble sink. The sleeping rooms in the
                photographs are air-conditioned.
              </p>
            </div>
          </article>
        ) : null}
      </section>
    </>
  );
}
