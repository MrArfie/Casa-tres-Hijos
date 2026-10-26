import { Link, createFileRoute } from "@tanstack/react-router";

import { RateBoard } from "@/components/site/rate-board";
import { heroPhoto, eveningPhotos, photos } from "@/lib/photos";
import { address, amenities, mapsDirectionsUrl, mapsEmbedUrl, packages, tagline } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28">
          <img
            src="/resort/logo-cream.png"
            alt="Casa Tres Hijos"
            className="h-20 w-auto max-w-[15rem] object-contain object-left drop-shadow-[0_10px_18px_rgba(25,25,25,0.45)] md:h-24"
          />
          <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] text-cream md:text-7xl">
            Your Private Escape Starts Here
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/90">
            An exclusive getaway for family gatherings, barkada bonding, and unforgettable
            celebrations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/book"
              className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-charcoal hover:bg-cream"
            >
              Book Your Stay
            </Link>
            <a
              href="#welcome"
              className="inline-flex h-12 items-center rounded-full border border-white/50 px-7 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore the Resort
            </a>
          </div>
        </div>
      </section>

      <section id="welcome" className="mx-auto grid max-w-6xl items-end gap-8 px-5 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="eyebrow text-gold-deep">Welcome</p>
          <h2 className="mt-3 text-5xl font-medium leading-[0.95] text-charcoal">{tagline}</h2>
        </div>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Casa Tres Hijos is a private retreat in Pampanga: a swimming pool, outdoor kitchen and
          grill, air-conditioned rooms, free Wi-Fi, Netflix, and videoke. Towels come with an overnight
          stay. The resort is
          rented to one group at a time.
        </p>
      </section>

      <section className="border-y border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <p className="eyebrow text-gold-deep">Amenities</p>
          <h2 className="mt-3 text-5xl font-medium text-charcoal">Included with the stay.</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {amenities.map((item) => (
              <Link key={item.id} to="/amenities" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-charcoal">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow text-gold-deep">Packages</p>
        <h2 className="mt-3 text-5xl font-medium text-charcoal">Day tour or overnight.</h2>
        <div className="mt-8">
          <RateBoard />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {packages.map((item) => (
            <Link
              key={item.id}
              to="/book"
              search={{ stay: item.id }}
              className="rounded-3xl border border-border bg-card p-6 shadow-card transition-colors hover:border-gold"
            >
              <h3 className="text-3xl font-medium text-charcoal">{item.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold-soft">In the evening</p>
              <h2 className="mt-3 max-w-md text-5xl font-medium leading-tight">Warm lights, the pool, the swings.</h2>
            </div>
            <Link to="/gallery" className="text-sm font-semibold text-gold-soft">
              Gallery
            </Link>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {eveningPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-3xl object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-5xl font-medium text-charcoal">From the property.</h2>
          <Link to="/gallery" className="text-sm font-semibold text-gold-deep">
            All photos
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.slice(0, 8).map((photo) => (
            <img
              key={photo.id}
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="aspect-square w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[1fr_1.4fr] md:py-20">
          <div>
            <p className="eyebrow text-gold-deep">Location</p>
            <h2 className="mt-3 text-4xl font-medium text-charcoal">{address}</h2>
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-charcoal px-6 text-sm font-semibold text-cream"
            >
              Get directions
            </a>
          </div>
          <iframe
            title="Casa Tres Hijos on Google Maps"
            src={mapsEmbedUrl}
            className="h-80 w-full rounded-3xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
