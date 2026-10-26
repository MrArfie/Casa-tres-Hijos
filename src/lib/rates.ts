import { eachNight } from "@/lib/booking-dates";
import type { StayQuote } from "@/lib/booking-types";

export const includedGuests = 10;
export const maxGuests = 13;
export const extraGuestFee = 500;
export const promoLastDate = "2026-12-31";

const promoRates = { weekday: 6999, weekend: 7999 };
const januaryRates = { weekday: 7499, weekend: 8499 };

export function peso(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function weekday(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)).getUTCDay();
}

function rateForDate(isoDate: string) {
  const weekend = [0, 5, 6].includes(weekday(isoDate));
  const promo = isoDate <= promoLastDate;
  const table = promo ? promoRates : januaryRates;
  return {
    amount: weekend ? table.weekend : table.weekday,
    band: weekend ? ("weekend" as const) : ("weekday" as const),
    period: promo ? ("promo" as const) : ("january" as const),
  };
}

export function quoteStay(input: {
  packageId: "day" | "overnight";
  date: string;
  checkOut: string;
  guests: number;
}): { ok: true; quote: StayQuote } | { ok: false; error: string } {
  if (!Number.isInteger(input.guests) || input.guests < 1 || input.guests > maxGuests) {
    return {
      ok: false,
      error: `Enter 1 to ${maxGuests} guests. The rate includes ${includedGuests}. Each guest above that adds ${peso(extraGuestFee)}.`,
    };
  }

  const nights = input.packageId === "overnight" ? eachNight(input.date, input.checkOut) : [input.date];
  if (nights.length === 0 || nights.some((date) => !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
    return { ok: false, error: "Choose a valid date." };
  }

  const lines = nights.map((date) => rateForDate(date));
  const base = lines.reduce((sum, line) => sum + line.amount, 0);
  const extraGuests = Math.max(0, input.guests - includedGuests);
  const extraFee = extraGuests * extraGuestFee;
  const bands = new Set(lines.map((line) => line.band));
  const periods = new Set(lines.map((line) => line.period));
  const bandLabel =
    bands.size === 1 ? (lines[0]?.band === "weekend" ? "Friday–Sunday" : "Monday–Thursday") : "weekday and weekend nights";
  const periodLabel =
    periods.size === 1
      ? lines[0]?.period === "promo"
        ? "Promo through December 2026"
        : "January 2027 rate"
      : "December promo and January rate";
  const stayLabel =
    input.packageId === "overnight" ? `${nights.length} night${nights.length === 1 ? "" : "s"}` : "Day tour";
  const extraLabel = extraGuests
    ? ` · ${extraGuests} extra guest${extraGuests === 1 ? "" : "s"} ${peso(extraFee)}`
    : "";

  return {
    ok: true,
    quote: {
      base,
      nights: nights.length,
      extraGuests,
      extraFee,
      total: base + extraFee,
      summary: `${periodLabel} · ${bandLabel} · ${stayLabel}${extraLabel}`,
    },
  };
}
