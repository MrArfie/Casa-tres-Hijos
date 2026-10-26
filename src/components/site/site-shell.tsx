import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { facebookUrl } from "@/lib/site";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const showBook = pathname !== "/book" && pathname !== "/admin";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <SiteFooter />
      {showBook ? (
        <Link
          to="/book"
          className="fixed bottom-5 left-5 z-40 inline-flex h-14 items-center rounded-full bg-gold px-5 text-sm font-semibold text-charcoal shadow-luxe lg:hidden"
        >
          Book your stay
        </Link>
      ) : null}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-[#0084FF] px-4 text-sm font-semibold text-white shadow-luxe"
      >
        <MessageCircle className="size-5" />
        Messenger
      </a>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <p className="eyebrow text-gold-deep">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight text-charcoal md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lede}</p>
      </div>
    </header>
  );
}
