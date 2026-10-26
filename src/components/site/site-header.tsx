import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { logo } from "@/lib/photos";
import { navLinks, resortName } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-[4.5rem]">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label={`${resortName} home`}>
          <img src={logo} alt="" className="h-14 w-auto max-w-[9.5rem] object-contain" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm font-medium text-charcoal/75 transition-colors hover:text-charcoal",
                isActive(pathname, link.to) && "text-gold-deep",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/booking-status"
            className="text-sm font-medium text-charcoal/75 hover:text-charcoal"
          >
            Check status
          </Link>
          <Link
            to="/book"
            className="inline-flex h-10 items-center rounded-full bg-gold px-5 text-sm font-semibold text-charcoal shadow-card transition-colors hover:bg-gold-deep hover:text-cream"
          >
            Book your stay
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-charcoal lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-border bg-background px-5 py-4 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "block rounded-xl px-3 py-3 text-base font-medium text-charcoal",
                    isActive(pathname, link.to) && "bg-secondary text-gold-deep",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/booking-status" className="block rounded-xl px-3 py-3 text-base font-medium">
                Check status
              </Link>
            </li>
            <li className="pt-2">
              <Link
                to="/book"
                className="flex h-11 items-center justify-center rounded-full bg-gold text-sm font-semibold text-charcoal"
              >
                Book your stay
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
