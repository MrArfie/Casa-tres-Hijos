import { createFileRoute } from "@tanstack/react-router";

import { GalleryView } from "@/components/site/gallery-view";
import { PageIntro } from "@/components/site/site-shell";
import { photos } from "@/lib/photos";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Casa Tres Hijos" },
      {
        name: "description",
        content: "Photographs of the pool, villa, lounge, and evening at Casa Tres Hijos.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Gallery"
        title="The house, in the light it actually has."
        lede="Pool at midday, rooms inside the A-frame, and the swings after dusk. Open any photo to see it larger."
      />
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <GalleryView photos={photos} />
      </section>
    </>
  );
}
