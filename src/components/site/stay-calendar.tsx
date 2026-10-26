import { useMemo, useState } from "react";

import { addDays, manilaToday } from "@/lib/booking-dates";
import type { PackageId } from "@/lib/site";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month, 1)),
  );
}

export function StayCalendar({
  packageId,
  blocked,
  checkIn,
  checkOut,
  onChange,
}: {
  packageId: PackageId;
  blocked: string[];
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
}) {
  const today = manilaToday();
  const [cursor, setCursor] = useState(() => today.slice(0, 7));
  const [year, monthNumber] = cursor.split("-").map(Number);
  const month = (monthNumber ?? 1) - 1;
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);

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

  function pick(date: string) {
    if (date < today || blockedSet.has(date)) return;
    if (packageId !== "overnight") {
      onChange(date, date);
      return;
    }
    if (!checkIn || checkOut || date <= checkIn) {
      onChange(date, "");
      return;
    }
    for (let cursorDate = checkIn; cursorDate < date; cursorDate = addDays(cursorDate, 1)) {
      if (blockedSet.has(cursorDate)) return;
    }
    onChange(checkIn, date);
  }

  const inRange = (date: string) =>
    packageId === "overnight" && checkIn && checkOut && date > checkIn && date < checkOut;

  return (
    <div>
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
          const taken = blockedSet.has(date);
          const past = date < today;
          const selected = date === checkIn || (packageId === "overnight" && date === checkOut);
          const day = Number(date.slice(-2));
          const status = taken ? "Booked" : past ? "" : "Open";
          return (
            <button
              key={date}
              type="button"
              disabled={past || taken}
              aria-label={`${day}, ${taken ? "booked" : past ? "past" : "available"}`}
              onClick={() => pick(date)}
              className={`flex h-14 flex-col items-center justify-center rounded-lg text-sm leading-none ${
                selected
                  ? "bg-charcoal font-semibold text-cream"
                  : inRange(date)
                    ? "bg-gold/30 text-charcoal"
                    : taken
                      ? "cursor-not-allowed bg-charcoal/10 font-medium text-charcoal/45"
                      : past
                        ? "cursor-not-allowed text-muted-foreground/40"
                        : "bg-card text-charcoal ring-1 ring-border hover:ring-gold"
              }`}
            >
              <span className={taken ? "line-through" : ""}>{day}</span>
              {status && !selected ? (
                <span className={`mt-1 text-[9px] font-semibold uppercase tracking-wide ${taken ? "text-charcoal/70" : "text-turquoise"}`}>
                  {status}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-card ring-1 ring-border" /> Open
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-charcoal/10" /> Booked
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Booked dates are already held by another group.{" "}
        {packageId === "overnight" ? "Tap an open check-in, then an open check-out. Check-out morning is free for the next group." : "Tap an open date."}
      </p>
    </div>
  );
}
