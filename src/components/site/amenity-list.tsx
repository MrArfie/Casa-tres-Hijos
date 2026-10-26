import {
  AirVent,
  Bath,
  BedDouble,
  CalendarDays,
  Flame,
  MapPin,
  Mic,
  ShieldCheck,
  Tv,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { amenities } from "@/lib/site";

const icons: Record<(typeof amenities)[number]["id"], LucideIcon> = {
  pool: Waves,
  kitchen: Flame,
  stay: BedDouble,
  wifi: Wifi,
  ac: AirVent,
  netflix: Tv,
  videoke: Mic,
  location: MapPin,
  clean: ShieldCheck,
  occasions: CalendarDays,
  towels: Bath,
};

export function AmenityList() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {amenities.map((item) => {
        const Icon = icons[item.id];
        return (
          <li key={item.id} className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-gold">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-2xl font-medium text-charcoal">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        );
      })}
    </ul>
  );
}
