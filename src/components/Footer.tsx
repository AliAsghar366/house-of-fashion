import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { categories } from "@/data/categories";
import { LogoMark } from "./Logo";

const WHATSAPP_NUMBER = "+923120744554";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;

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

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-lg bg-[#25D366] p-2 text-white hover:bg-[#20BA5C] transition-colors"
            >
              <WhatsAppIcon />
            </a>
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
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-[#25D366]/15 border-2 border-[#25D366]/30 px-3 py-1.5 text-ink hover:bg-[#25D366]/25 transition-colors"
              >
                <MessageCircle size={16} className="text-[#25D366] shrink-0" />
                <span className="text-sm font-semibold">WhatsApp: {WHATSAPP_NUMBER}</span>
              </a>
            </li>
            <li className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-ink">
              <Phone size={16} className="shrink-0" />
              <span className="text-sm font-semibold">{WHATSAPP_NUMBER}</span>
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
          © {new Date().getFullYear()} House of Fashion. All prices shown in PKR.
        </span>
      </div>
    </footer>
  );
}
