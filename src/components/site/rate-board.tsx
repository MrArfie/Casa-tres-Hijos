import { peso } from "@/lib/rates";

const cards = [
  { label: "Monday – Thursday", promo: 6999, later: 7499 },
  { label: "Friday – Sunday", promo: 7999, later: 8499 },
] as const;

export function RateBoard() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <article key={card.label} className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-deep">{card.label}</p>
            <p className="mt-3 text-5xl font-medium text-charcoal">{peso(card.promo)}</p>
            <p className="mt-2 text-sm text-muted-foreground">From January 2027, {peso(card.later)}</p>
          </article>
        ))}
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Promo rates run through December 2026. The rate includes 10 guests. Guests 11 to 13 add ₱500 each. Day
        tour is one rate for that date. Overnight uses the rate of each night. Check-in is 2:00 PM and check-out
        is 12:00 noon. From January 2027, each rate is ₱500 higher.
      </p>
    </div>
  );
}
