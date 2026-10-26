import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { PageIntro } from "@/components/site/site-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkBooking } from "@/lib/booking-api";
import { peso } from "@/lib/rates";
import { packageLabel } from "@/lib/site";

export const Route = createFileRoute("/booking-status")({
  head: () => ({
    meta: [
      { title: "Check Booking Status — Casa Tres Hijos" },
      {
        name: "description",
        content: "Look up a Casa Tres Hijos booking with the reference and the mobile number used to book.",
      },
    ],
  }),
  component: StatusPage,
});

function StatusPage() {
  const [result, setResult] = useState<Awaited<ReturnType<typeof checkBooking>> | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setResult(
      await checkBooking({
        data: {
          reference: String(data.get("reference") ?? ""),
          phone: String(data.get("phone") ?? ""),
        },
      }),
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Check booking status"
        title="Use your reference and mobile number."
        lede="The status is shown only when both match the booking. Other guests’ details stay hidden."
      />
      <section className="mx-auto max-w-xl px-5 py-16">
        <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="grid gap-2">
            <Label htmlFor="reference">Booking reference</Label>
            <Input id="reference" name="reference" required placeholder="CTH-XXXXXX" className="h-11 rounded-xl bg-card uppercase" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Philippine mobile number</Label>
            <Input id="phone" name="phone" type="tel" required className="h-11 rounded-xl bg-card" />
          </div>
          <button type="submit" className="h-11 rounded-full bg-charcoal text-sm font-semibold text-cream">
            Look up
          </button>
        </form>
        {result && !result.found ? (
          <p className="mt-6 text-sm text-muted-foreground">No booking matches that reference and mobile number.</p>
        ) : null}
        {result?.found ? (
          <article className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card">
            <p className="eyebrow text-gold-deep">{result.status}</p>
            <h2 className="mt-2 text-3xl font-medium text-charcoal">{result.reference}</h2>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{result.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Package</dt>
                <dd className="font-medium">{packageLabel(result.packageId)}</dd>
              </div>
              {result.quote ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Rate</dt>
                  <dd className="text-right font-medium">
                    {peso(result.quote.total)}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">{result.quote.summary}</span>
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Date</dt>
                <dd className="font-medium">
                  {result.date}
                  {result.packageId === "overnight" ? ` to ${result.checkOut}` : ""}
                </dd>
              </div>
            </dl>
          </article>
        ) : null}
      </section>
    </>
  );
}
