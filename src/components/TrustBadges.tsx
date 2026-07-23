import { ShieldCheck, Truck, RotateCcw, BadgeCheck } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Buyer Protection", desc: "Secure checkout, every order" },
  { icon: BadgeCheck, label: "Verified Seller", desc: "Trusted House of Fashion store" },
  { icon: Truck, label: "Nationwide Shipping", desc: "Delivered across Pakistan" },
  { icon: RotateCcw, label: "7-Day Returns", desc: "Easy, no-questions returns" },
];

export function TrustBadges() {
  return (
    <section className="border-y-2 border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-primary/10 p-3 text-ink">
              <b.icon size={22} />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">{b.label}</p>
              <p className="text-xs text-ink/65">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
