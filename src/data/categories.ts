export type Category = {
  slug: string;
  name: string;
  tagline: string;
  emoji: string;
  imageFolder: string;
  imageCount: number;
};

export const categories: Category[] = [
  {
    slug: "perfumes",
    name: "Perfumes & Fragrances",
    tagline: "Scents that linger in the memory",
    emoji: "🌸",
    imageFolder: "perfumes",
    imageCount: 15,
  },
  {
    slug: "cushions",
    name: "Cushions & Throw Pillows",
    tagline: "Sink into softness",
    emoji: "🛋️",
    imageFolder: "cushions",
    imageCount: 15,
  },
  {
    slug: "handbags",
    name: "Handbags & Purses",
    tagline: "Carry it with attitude",
    emoji: "👜",
    imageFolder: "handbags",
    imageCount: 15,
  },
  {
    slug: "jewelry",
    name: "Jewelry & Statement Pieces",
    tagline: "Shine on your own terms",
    emoji: "💎",
    imageFolder: "jewelry",
    imageCount: 15,
  },
  {
    slug: "sunglasses",
    name: "Sunglasses & Eyewear",
    tagline: "See the world in style",
    emoji: "🕶️",
    imageFolder: "sunglasses",
    imageCount: 15,
  },
  {
    slug: "scarves",
    name: "Scarves & Wraps",
    tagline: "Drape yourself in luxury",
    emoji: "🧣",
    imageFolder: "scarves",
    imageCount: 15,
  },
  {
    slug: "wallets",
    name: "Wallets & Clutches",
    tagline: "Small, sleek, essential",
    emoji: "👛",
    imageFolder: "wallets",
    imageCount: 15,
  },
  {
    slug: "hair-accessories",
    name: "Hair Accessories",
    tagline: "Details that turn heads",
    emoji: "🎀",
    imageFolder: "hair-accessories",
    imageCount: 15,
  },
  {
    slug: "watches",
    name: "Watches & Wristwear",
    tagline: "Time, worn beautifully",
    emoji: "⌚",
    imageFolder: "watches",
    imageCount: 15,
  },
  {
    slug: "candles",
    name: "Scented Candles",
    tagline: "Set the mood, one flicker at a time",
    emoji: "🕯️",
    imageFolder: "candles",
    imageCount: 15,
  },
  {
    slug: "vases",
    name: "Decorative Vases",
    tagline: "Sculptural pieces for every room",
    emoji: "🏺",
    imageFolder: "vases",
    imageCount: 15,
  },
  {
    slug: "belts",
    name: "Belts",
    tagline: "Cinch it, finish the look",
    emoji: "👗",
    imageFolder: "belts",
    imageCount: 15,
  },
  {
    slug: "mens-shalwar-kameez",
    name: "Men's Shalwar Kameez",
    tagline: "Classic stitched menswear, ready to wear",
    emoji: "🧵",
    imageFolder: "mens-shalwar-kameez",
    imageCount: 22,
  },
  {
    slug: "womens-lawn-suits",
    name: "Women's Lawn & Unstitched Suits",
    tagline: "Unstitched 3-piece fabric, tailor it your way",
    emoji: "🧶",
    imageFolder: "womens-lawn-suits",
    imageCount: 30,
  },
  {
    slug: "kids-traditional-wear",
    name: "Kids' Traditional Wear",
    tagline: "Mini shalwar kameez and frocks, festival-ready",
    emoji: "🧒",
    imageFolder: "kids-traditional-wear",
    imageCount: 29,
  },
  {
    slug: "kitchen-storage",
    name: "Kitchen & Storage",
    tagline: "Tidy jars, boxes and everyday kitchen finds",
    emoji: "🥡",
    imageFolder: "kitchen-storage",
    imageCount: 15,
  },
  {
    slug: "stationery-desk",
    name: "Stationery & Desk",
    tagline: "Cute desk clutter you'll actually use",
    emoji: "✏️",
    imageFolder: "stationery-desk",
    imageCount: 15,
  },
  {
    slug: "bathroom-accessories",
    name: "Bathroom & Home Finds",
    tagline: "Small household upgrades, Miniso-style",
    emoji: "🧴",
    imageFolder: "bathroom-accessories",
    imageCount: 15,
  },
  {
    slug: "bedsheets",
    name: "Bedsheets & Bedding",
    tagline: "Soft sets for a better night's sleep",
    emoji: "🛏️",
    imageFolder: "bedsheets",
    imageCount: 15,
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
