import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { PageIntro } from "@/components/site/site-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/lib/booking-api";
import { address, facebookUrl, mapsDirectionsUrl, mapsEmbedUrl } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — Casa Tres Hijos, Daffodil Street, Pampanga" },
      {
        name: "description",
        content:
          "Casa Tres Hijos is on Daffodil Street, Pampanga. Message the resort on Facebook or send an inquiry.",
      },
    ],
  }),
  component: ContactPage,
});

const field = "h-11 rounded-xl bg-card";

function ContactPage() {
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    const result = await submitInquiry({
      data: {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
      },
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(result.inquiry.id);
  }

  return (
    <>
      <PageIntro
        eyebrow="Contact and location"
        title={address}
        lede="Send a message to the resort. It appears in the resort desk. You can also reach Casa Tres Hijos on Facebook."
      />
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2">
        {saved ? (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <p className="eyebrow text-gold-deep">Message received</p>
            <h2 className="mt-3 text-3xl font-medium text-charcoal">{saved}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The resort can see this in the desk. You can also message the Facebook page if you want a faster reply.
            </p>
            <a href={facebookUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-semibold text-gold-deep">
              Open Facebook
            </a>
          </div>
        ) : (
        <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" className={field} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Philippine mobile number</Label>
            <Input id="phone" name="phone" required type="tel" autoComplete="tel" className={field} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" className={field} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required className="min-h-32 rounded-xl bg-card" />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button type="submit" disabled={pending} className="h-12 rounded-full bg-gold text-sm font-semibold text-charcoal disabled:opacity-60">
            {pending ? "Sending…" : "Send message"}
          </button>
          <a href={mapsDirectionsUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-gold-deep">
            Get directions
          </a>
        </form>
        )}
        <iframe
          title="Casa Tres Hijos on Google Maps"
          src={mapsEmbedUrl}
          className="min-h-80 w-full rounded-3xl border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
