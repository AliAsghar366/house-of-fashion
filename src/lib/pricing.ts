export type PriceTier = { minQty: number; price: number };

export function tieredUnitPrice(tiers: PriceTier[], qty: number, variantPrice?: number): number {
  // If a specific variant price is set, use that instead of tier pricing
  if (variantPrice !== undefined) return variantPrice;
  let unit = tiers[0].price;
  for (const tier of tiers) {
    if (qty >= tier.minQty) unit = tier.price;
  }
  return unit;
}

export function lineTotal(tiers: PriceTier[], qty: number): number {
  return tieredUnitPrice(tiers, qty) * qty;
}
