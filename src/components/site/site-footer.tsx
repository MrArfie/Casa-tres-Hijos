import { Link } from "@tanstack/react-router";

import { logo } from "@/lib/photos";
import { address, facebookUrl, navLinks, resortName, tagline } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-charcoal text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={logo} alt="" className="h-20 w-auto max-w-[12rem] object-contain" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">{tagline}</p>
        </div>
        <div>
          <p className="eyebrow text-gold-soft">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold-soft">Plan</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <Link to="/book" className="hover:text-cream">
                Book your stay
              </Link>
            </li>
            <li>
              <Link to="/booking-status" className="hover:text-cream">
                Check booking status
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cream">
                Contact and location
              </Link>
            </li>
            <li>
              <a href={facebookUrl} className="hover:text-cream" target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <Link to="/admin" className="hover:text-cream">
                Admin
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-sm text-cream/70">{address}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-cream/50">
          © {new Date().getFullYear()} {resortName}
        </p>
      </div>
    </footer>
  );
}
