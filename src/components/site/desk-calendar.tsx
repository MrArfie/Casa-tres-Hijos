import { useMemo, useState } from "react";

import { addDays, eachNight, manilaToday } from "@/lib/booking-dates";
import type { Booking } from "@/lib/booking-types";
import { packageLabel } from "@/lib/site";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month, 1)),
  );
}

function heldNights(booking: Booking) {
  if (booking.status !== "pending" && booking.status !== "confirmed") return [];
  const end = booking.packageId === "overnight" ? booking.checkOut : addDays(booking.date, 1);
  return eachNight(booking.date, end);
}

export function DeskCalendar({ bookings }: { bookings: Booking[] }) {
  const today = manilaToday();
  const [cursor, setCursor] = useState(() => today.slice(0, 7));
  const [selected, setSelected] = useState("");
  const [year, monthNumber] = cursor.split("-").map(Number);
  const month = (monthNumber ?? 1) - 1;

  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const booking of bookings) {
      for (const date of heldNights(booking)) {
        map.set(date, [...(map.get(date) ?? []), booking]);
      }
    }
    return map;
  }, [bookings]);

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(year ?? 2026, month, 1));
    const days = new Date(Date.UTC(year ?? 2026, month + 1, 0)).getUTCDate();
    const leading = Array.from({ length: first.getUTCDay() }, () => "");
    const dates = Array.from({ length: days }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      return `${year}-${String(month + 1).padStart(2, "0")}-${day}`;
    });
    return [...leading, ...dates];
  }, [year, month]);

  const chosen = selected ? (byDate.get(selected) ?? []) : [];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <button type="button" className="text-sm font-semibold text-charcoal" onClick={() => setCursor(addDays(`${cursor}-01`, -1).slice(0, 7))}>
          Previous
        </button>
        <p className="text-sm font-semibold text-charcoal">{monthLabel(year ?? 2026, month)}</p>
        <button type="button" className="text-sm font-semibold text-charcoal" onClick={() => setCursor(addDays(`${cursor}-01`, 32).slice(0, 7))}>
          Next
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, index) => {
          if (!date) return <span key={`empty-${index}`} />;
          const holds = byDate.get(date) ?? [];
          const status = holds.some((booking) => booking.status === "confirmed")
            ? "Confirmed"
            : holds.some((booking) => booking.status === "pending")
              ? "Pending"
              : "";
          const day = Number(date.slice(-2));
          return (
            <button
              key={date}
              type="button"
              aria-label={`${day}, ${status ? status.toLowerCase() : "open"}`}
              onClick={() => setSelected(date)}
              className={`flex h-14 flex-col items-center justify-center rounded-lg text-sm leading-none ${
                date === selected
                  ? "bg-charcoal font-semibold text-cream"
                  : status === "Confirmed"
                    ? "bg-turquoise/20 font-medium text-charcoal"
                    : status === "Pending"
                      ? "bg-gold/30 font-medium text-charcoal"
                      : "bg-cream text-charcoal"
              }`}
            >
              <span>{day}</span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide">{status || "Open"}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-cream" /> Open</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-gold/40" /> Pending</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-turquoise/40" /> Confirmed</span>
      </div>
      <div className="mt-4 border-t border-border pt-4 text-sm">
        {selected ? (
          chosen.length ? (
            <ul className="grid gap-2">
              {chosen.map((booking) => (
                <li key={booking.reference}>
                  <p className="font-medium text-charcoal">
                    {selected} · {booking.status} · {booking.reference}
                  </p>
                  <p className="text-muted-foreground">
                    {booking.name} · {packageLabel(booking.packageId)} · {booking.guests} guests
                    {booking.packageId === "overnight" ? ` · check-out ${booking.checkOut}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">{selected} is open.</p>
          )
        ) : (
          <p className="text-muted-foreground">Tap a date to see who holds it. Pending and confirmed dates stay closed to new guests.</p>
        )}
      </div>
    </div>
  );
}
