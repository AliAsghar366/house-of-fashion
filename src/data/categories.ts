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
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
