import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { StayCalendar } from "@/components/site/stay-calendar";
import { PageIntro } from "@/components/site/site-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { stayAvailability, submitBooking } from "@/lib/booking-api";
import type { Booking } from "@/lib/booking-types";
import { maxGuests, peso, quoteStay } from "@/lib/rates";
import { packageLabel, packages, type PackageId } from "@/lib/site";

const field = "h-11 rounded-xl bg-card";

function isPackage(value: unknown): value is PackageId {
  return packages.some((item) => item.id === value);
}

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    stay: isPackage(search.stay) ? search.stay : "overnight",
  }),
  head: () => ({
    meta: [
      { title: "Book Now — Casa Tres Hijos Private Resort" },
      {
        name: "description",
        content: "Request a day tour or overnight stay at Casa Tres Hijos. The page shows the rate for your date.",
      },
    ],
  }),
  component: BookPage,
});

function QuoteLine({
  packageId,
  checkIn,
  checkOut,
  guests,
}: {
  packageId: PackageId;
  checkIn: string;
  checkOut: string;
  guests: string;
}) {
  const count = Number(guests);
  const ready = Boolean(checkIn) && (packageId !== "overnight" || Boolean(checkOut));
  const priced =
    ready && Number.isInteger(count)
      ? quoteStay({
          packageId,
          date: checkIn,
          checkOut: packageId === "overnight" ? checkOut : checkIn,
          guests: count,
        })
      : null;

  if (!checkIn) return <p className="text-sm text-muted-foreground">Choose a date to see the rate.</p>;
  if (packageId === "overnight" && !checkOut) {
    return <p className="text-sm text-muted-foreground">Check-in {checkIn}. Choose check-out to see the rate.</p>;
  }
  if (!priced || !priced.ok) {
    return <p className="text-sm text-destructive">{priced?.error ?? "Enter the number of guests."}</p>;
  }

  return (
    <div className="rounded-2xl bg-cream px-4 py-4">
      <p className="text-sm text-muted-foreground">{priced.quote.summary}</p>
      <p className="mt-1 text-3xl font-medium text-charcoal">{peso(priced.quote.total)}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Payment is arranged with Casa Tres Hijos after the booking is confirmed.
      </p>
    </div>
  );
}

function BookPage() {
  const { stay } = Route.useSearch();
  const [packageId, setPackageId] = useState<PackageId>(stay);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("10");
  const [blocked, setBlocked] = useState<string[]>([]);
  const [saved, setSaved] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void stayAvailability().then((result) => setBlocked(result.dates));
  }, [saved]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!checkIn || (packageId === "overnight" && !checkOut)) {
      setError(packageId === "overnight" ? "Choose a check-in and a check-out." : "Choose a date.");
      return;
    }
    setPending(true);
    setError("");
    const result = await submitBooking({
      data: {
        packageId,
        date: checkIn,
        checkOut,
        guests,
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        notes: String(data.get("notes") ?? ""),
      },
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(result.booking);
  }

  return (
    <>
      <PageIntro
        eyebrow="Book now"
        title="Choose an open date."
        lede="A pending request holds the whole resort until Casa Tres Hijos confirms it. The rate appears before you submit. Payment is arranged with the resort, and it is not collected on this page."
      />
      <section className="mx-auto max-w-3xl px-5 py-16">
        {saved ? (
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <p className="eyebrow text-gold-deep">Booking received</p>
            <h2 className="mt-3 text-4xl font-medium text-charcoal">{saved.reference}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Status: pending. Keep this reference and the mobile number you entered.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="h-11 rounded-full bg-charcoal px-5 text-sm font-semibold text-cream"
                onClick={() => {
                  void navigator.clipboard?.writeText(saved.reference);
                  setCopied(true);
                }}
              >
                {copied ? "Copied" : "Copy reference"}
              </button>
              <Link
                to="/booking-status"
                className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-semibold text-charcoal"
              >
                Check status
              </Link>
            </div>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Package</dt>
                <dd className="font-medium">{packageLabel(saved.packageId)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Date</dt>
                <dd className="font-medium">
                  {saved.date}
                  {saved.packageId === "overnight" ? ` to ${saved.checkOut}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Guests</dt>
                <dd className="font-medium">{saved.guests}</dd>
              </div>
              {saved.quote ? (
                <div>
                  <dt className="text-muted-foreground">Rate</dt>
                  <dd className="font-medium">
                    {peso(saved.quote.total)}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">{saved.quote.summary}</span>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{saved.name}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="grid gap-2">
              <Label htmlFor="stay">Package</Label>
              <select
                id="stay"
                value={packageId}
                onChange={(event) => {
                  setPackageId(event.target.value as PackageId);
                  setCheckIn("");
                  setCheckOut("");
                }}
                className="h-11 rounded-xl border border-input bg-card px-3 text-sm"
              >
                {packages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <StayCalendar
              packageId={packageId}
              blocked={blocked}
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={(nextIn, nextOut) => {
                setCheckIn(nextIn);
                setCheckOut(nextOut);
              }}
            />
            <QuoteLine packageId={packageId} checkIn={checkIn} checkOut={checkOut} guests={guests} />
            <div className="grid gap-2">
              <Label htmlFor="guests">Number of guests</Label>
              <Input
                id="guests"
                name="guests"
                inputMode="numeric"
                required
                min={1}
                max={maxGuests}
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
                className={field}
              />
              <p className="text-xs text-muted-foreground">
                The rate includes 10 guests. Guests 11 to 13 add ₱500 each.
                {packageId === "day"
                  ? " Day tour guests may use the loft. Towels are not included."
                  : " Check-in is 2:00 PM and check-out is 12:00 noon. Towels are included."}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required autoComplete="name" className={field} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Philippine mobile number</Label>
                <Input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="09" className={field} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" className={field} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Special requests</Label>
              <Textarea id="notes" name="notes" className="min-h-28 rounded-xl bg-card" />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <button type="submit" disabled={pending} className="h-12 rounded-full bg-gold text-sm font-semibold text-charcoal disabled:opacity-60">
              {pending ? "Saving…" : "Submit booking"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
