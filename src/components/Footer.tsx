import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { categories } from "@/data/categories";
import { LogoMark } from "./Logo";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-6.9L4.7 22H1.6l8.1-9.3L1 2h7.1l4.9 6.3L18.9 2Zm-1.2 18h1.9L7.4 4H5.3l12.4 16Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-bar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 mb-3 rounded-lg bg-primary px-3 py-1.5 hover:bg-primary-dark transition-colors">
            <LogoMark />
            <span className="font-display text-lg text-ink">House of Fashion</span>
          </Link>
          <p className="text-sm font-semibold text-ink max-w-xs rounded-lg bg-primary px-3 py-2">
            Fashion accessories, home decor and fragrance, curated with a playful
            edge. Wholesale-friendly pricing on every piece.
          </p>
          <div className="flex gap-2 mt-4">
            <a href="#" aria-label="Instagram" className="rounded-lg bg-primary p-2 text-ink hover:bg-primary-dark transition-colors">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-lg bg-primary p-2 text-ink hover:bg-primary-dark transition-colors">
              <FacebookIcon />
            </a>
            <a href="#" aria-label="Twitter" className="rounded-lg bg-primary p-2 text-ink hover:bg-primary-dark transition-colors">
              <XIcon />
            </a>
          </div>
        </div>

        <div>
          <h4 className="inline-block font-display text-base mb-3 rounded-lg bg-primary px-3 py-1 text-ink">Shop Niches</h4>
          <ul className="flex flex-col items-start gap-2">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/${c.slug}`}
                  className="inline-block rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-ink hover:bg-primary-dark transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="inline-block font-display text-base mb-3 rounded-lg bg-primary px-3 py-1 text-ink">Company</h4>
          <ul className="flex flex-col items-start gap-2">
            {[
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
              { href: "/wishlist", label: "Wishlist" },
              { href: "/compare", label: "Compare Products" },
              { href: "/cart", label: "Cart" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-ink hover:bg-primary-dark transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="inline-block font-display text-base mb-3 rounded-lg bg-primary px-3 py-1 text-ink">Get in Touch</h4>
          <ul className="flex flex-col items-start gap-2">
            <li className="flex items-start gap-2 rounded-lg bg-primary px-3 py-1.5 text-ink">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span className="text-sm font-semibold">Shop 14, Zamzama Boulevard, Phase 5, DHA, Karachi, Pakistan</span>
            </li>
            <li className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-ink">
              <Phone size={16} className="shrink-0" />
              <span className="text-sm font-semibold">+92 300 1234567</span>
            </li>
            <li className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-ink">
              <Mail size={16} className="shrink-0" />
              <span className="text-sm font-semibold">hello@houseoffashion.pk</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-primary/30 py-5 text-center">
        <span className="inline-block rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-ink">
          © {new Date().getFullYear()} House of Fashion. All prices shown in PKR. Placeholder contact details — to be updated.
        </span>
      </div>
    </footer>
  );
}
