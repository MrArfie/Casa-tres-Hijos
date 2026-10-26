import { createFileRoute } from "@tanstack/react-router";

import { PageIntro } from "@/components/site/site-shell";
import { faqs, houseRules, poolRules } from "@/lib/site";
import { rulePosters } from "@/lib/photos";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "House Rules & FAQs — Casa Tres Hijos" },
      {
        name: "description",
        content:
          "Casa Tres Hijos house rules, quiet hours from 10:00 PM to 7:00 AM, and swimming pool rules.",
      },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  return (
    <>
      <PageIntro
        eyebrow="House rules and FAQs"
        title="The rules posted at the resort."
        lede="These are taken from the Casa Tres Hijos house rules, quiet hours, and swimming pool signs. They will be editable from the admin dashboard once that is connected."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-3">
        <img src={rulePosters.houseRules} alt="Casa Tres Hijos house rules poster" className="w-full rounded-3xl shadow-card" />
        <img src={rulePosters.quietHours} alt="Quiet hours 10:00 PM to 7:00 AM" className="w-full rounded-3xl shadow-card" />
        <img src={rulePosters.poolRules} alt="Casa Tres Hijos swimming pool rules" className="w-full rounded-3xl shadow-card" />
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-8 md:grid-cols-2 md:py-12">
        <div className="space-y-4">
          {houseRules.map((rule, index) => (
            <article key={rule.title} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-2xl font-medium text-charcoal">
                {index + 1}. {rule.title}
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                {rule.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div>
          <h2 className="text-3xl font-medium text-charcoal">Swimming pool rules</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {poolRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          <h2 className="mt-10 text-3xl font-medium text-charcoal">FAQs</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-2xl border border-border bg-card px-5 py-4">
                <summary className="cursor-pointer font-semibold text-charcoal">{faq.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
