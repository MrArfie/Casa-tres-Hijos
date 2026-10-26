import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All" },
  { id: "pool", label: "Pool" },
  { id: "interior", label: "Interior" },
  { id: "outdoor", label: "Outdoor" },
  { id: "evening", label: "Evening" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export function GalleryView({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const shown = filter === "all" ? photos : photos.filter((photo) => photo.category === filter);
  const activeIndex = shown.findIndex((photo) => photo.id === activeId);
  const active = activeIndex >= 0 ? shown[activeIndex] : null;

  useEffect(() => {
    if (!active) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveId(null);
      if (event.key === "ArrowRight") {
        setActiveId(shown[(activeIndex + 1) % shown.length]?.id ?? null);
      }
      if (event.key === "ArrowLeft") {
        setActiveId(shown[(activeIndex - 1 + shown.length) % shown.length]?.id ?? null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeIndex, shown]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter photos">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === item.id
                ? "border-charcoal bg-charcoal text-cream"
                : "border-border bg-card text-charcoal hover:border-gold",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {shown.map((photo) => (
          <li key={photo.id} className={photo.id === "pool-wide-day" ? "col-span-2" : undefined}>
            <button
              type="button"
              onClick={() => setActiveId(photo.id)}
              className="group block w-full overflow-hidden rounded-2xl text-left shadow-card"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="block bg-card px-4 py-3 text-sm font-medium text-charcoal">
                {photo.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
        >
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
            onClick={() => setActiveId(null)}
          >
            <span className="sr-only">Close</span>
            <X className="size-5" />
          </button>
          <figure className="max-h-[88vh] max-w-5xl">
            <img src={active.src} alt={active.alt} className="max-h-[78vh] w-full rounded-2xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-cream">{active.caption}</figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
