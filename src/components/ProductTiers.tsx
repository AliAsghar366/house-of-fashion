import type { PriceTier } from "@/lib/pricing";
import { formatPKR } from "@/lib/currency";

export function ProductTiers({ tiers, activeQty }: { tiers: PriceTier[]; activeQty: number }) {
  return (
    <div className="rounded-lg border-2 border-ink/10 bg-lavender/50 overflow-hidden">
      <div className="grid grid-cols-3 divide-x-2 divide-ink/10">
        {tiers.map((tier, i) => {
          const nextTier = tiers[i + 1];
          const label = nextTier
            ? `${tier.minQty}-${nextTier.minQty - 1} pcs`
            : `${tier.minQty}+ pcs`;
          const isActive =
            activeQty >= tier.minQty && (!nextTier || activeQty < nextTier.minQty);
          return (
            <div
              key={tier.minQty}
              className={`p-3 text-center transition-colors ${
                isActive ? "bg-primary text-ink" : ""
              }`}
            >
              <p className={`text-[11px] font-medium ${isActive ? "text-ink/70" : "text-ink/65"}`}>
                {label}
              </p>
              <p className="font-display text-lg mt-0.5">{formatPKR(tier.price)}</p>
              <p className={`text-[10px] ${isActive ? "text-ink/60" : "text-ink/55"}`}>per unit</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
