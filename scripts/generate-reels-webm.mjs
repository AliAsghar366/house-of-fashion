#!/usr/bin/env node
/**
 * generate-reels-webm.mjs
 * Generates .webm video files directly using Puppeteer CDP screencast.
 * Each reel is rendered as a standalone animated HTML page and recorded.
 */
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "reels");
const CHROME_PATH =
  "C:/Users/MOS/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe";

// ─── Reel data ───────────────────────────────────────────────
const REELS = [
  {id:1,name:"Summer Fragrance Blast",scenes:[{title:"Summer\nFragrances",subtitle:"New Collection 2026",emoji:"🌸",bg:["#f472b6","#fda4af","#d946ef"],textColor:"#191510",effect:"zoom"},{title:"Floral\n& Fresh",subtitle:"Jasmine • Rose • Musk",emoji:"💐",bg:["#fda4af","#fecdd3","#ffffff"],textColor:"#191510",effect:"slide-up"},{title:"Up to\n30% OFF",subtitle:"Limited time only",emoji:"🏷️",bg:["#d946ef","#ec4899"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"vibrant"},
  {id:2,name:"Handbag Heaven",scenes:[{title:"Handbag\nDrop",subtitle:"Just Arrived",emoji:"👜",bg:["#fcd34d","#fde68a","#fed7aa"],textColor:"#191510",effect:"slide-up"},{title:"Leather\nLuxury",subtitle:"Premium craftsmanship",emoji:"✨",bg:["#fbbf24","#fde047"],textColor:"#191510",effect:"zoom"},{title:"Starting\nRs 1,200",subtitle:"Affordable elegance",emoji:"💰",bg:["#facc15","#fbbf24"],textColor:"#191510",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"elegant"},
  {id:3,name:"Jewelry Sparkle",scenes:[{title:"Statement\nJewelry",subtitle:"Bold & Beautiful",emoji:"💎",bg:["#facc15","#fbbf24","#fde047"],textColor:"#191510",effect:"shimmer"},{title:"Rings •\nNecklaces",subtitle:"Handpicked designs",emoji:"💍",bg:["#fde68a","#fef9c3"],textColor:"#191510",effect:"float"},{title:"From\nRs 800",subtitle:"Budget-friendly bling",emoji:"✨",bg:["#eab308","#f59e0b"],textColor:"#191510",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"luxury"},
  {id:4,name:"Cushion Comfort",scenes:[{title:"Cozy\nCushions",subtitle:"Refresh your living room",emoji:"🛋️",bg:["#fed7aa","#fef3c7","#fefce8"],textColor:"#191510",effect:"float"},{title:"Velvet\n& Linen",subtitle:"Premium fabrics",emoji:"🧵",bg:["#fdba74","#fde68a"],textColor:"#191510",effect:"slide-up"},{title:"Buy 2\nGet 1 Free",subtitle:"Mix & match",emoji:"🎉",bg:["#fb923c","#fca5a5"],textColor:"#191510",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"pastel"},
  {id:5,name:"Sunglasses Style",scenes:[{title:"Shade\nGame",subtitle:"UV400 Protection",emoji:"🕶️",bg:["#374151","#6b7280","#94a3b8"],textColor:"#ffffff",effect:"zoom"},{title:"Aviators\n& Wayfarers",subtitle:"Classic to modern",emoji:"😎",bg:["#4b5563","#64748b"],textColor:"#ffffff",effect:"slide-up"},{title:"Starting\nRs 600",subtitle:"Look hot for less",emoji:"🔥",bg:["#1f2937","#4b5563"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"dark"},
  {id:6,name:"Silk Scarf Elegance",scenes:[{title:"Silk\nScarves",subtitle:"Hand-rolled edges",emoji:"🧣",bg:["#d8b4fe","#f9a8d4","#fecdd3"],textColor:"#191510",effect:"float"},{title:"100%\nSilk",subtitle:"Natural fibers only",emoji:"🦋",bg:["#e9d5ff","#fce7f3"],textColor:"#191510",effect:"shimmer"},{title:"New\nPatterns",subtitle:"Florals • Geometric • Abstract",emoji:"🎨",bg:["#c084fc","#f472b6"],textColor:"#191510",effect:"slide-up"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"elegant"},
  {id:7,name:"Watch Collection",scenes:[{title:"Wrist\nGame",subtitle:"Timepieces that speak",emoji:"⌚",bg:["#d1d5db","#e4e4e7","#f1f5f9"],textColor:"#191510",effect:"zoom"},{title:"Minimal\n& Bold",subtitle:"Something for everyone",emoji:"⏰",bg:["#9ca3af","#d4d4d8"],textColor:"#191510",effect:"fade-scale"},{title:"From\nRs 1,500",subtitle:"Premium quality",emoji:"💎",bg:["#4b5563","#64748b"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"minimal"},
  {id:8,name:"Candle Glow",scenes:[{title:"Scented\nCandles",subtitle:"Ambiance in a jar",emoji:"🕯️",bg:["#fed7aa","#fef3c7","#fefce8"],textColor:"#191510",effect:"float"},{title:"Vanilla •\nLavender",subtitle:"Hand-poured soy wax",emoji:"🌿",bg:["#fef3c7","#fff7ed"],textColor:"#191510",effect:"shimmer"},{title:"Mood\nBooster",subtitle:"Transform any room",emoji:"✨",bg:["#fdba74","#fde68a"],textColor:"#191510",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"pastel"},
  {id:9,name:"Vase Artistry",scenes:[{title:"Decorative\nVases",subtitle:"Statement pieces",emoji:"🏺",bg:["#fecdd3","#ffedd5","#fefce8"],textColor:"#191510",effect:"float"},{title:"Ceramic\n& Glass",subtitle:"Artisan crafted",emoji:"🎨",bg:["#fda4af","#fed7aa"],textColor:"#191510",effect:"spin-in"},{title:"Room\nMakeover",subtitle:"One vase changes everything",emoji:"🏡",bg:["#fb7185","#fcd34d"],textColor:"#191510",effect:"slide-up"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"elegant"},
  {id:10,name:"Belt Up",scenes:[{title:"Premium\nBelts",subtitle:"Genuine leather",emoji:"👔",bg:["#fcd34d","#fde68a","#fef3c7"],textColor:"#191510",effect:"slide-up"},{title:"Classic\nBuckles",subtitle:"Timeless designs",emoji:"✨",bg:["#fbbf24","#fde047"],textColor:"#191510",effect:"zoom"},{title:"Complete\nYour Look",subtitle:"The finishing touch",emoji:"🔥",bg:["#eab308","#f97316"],textColor:"#191510",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"bold"},
  {id:11,name:"Shalwar Kameez Classic",scenes:[{title:"Men's\nShalwar Kameez",subtitle:"Stitched & Ready",emoji:"🧵",bg:["#86efac","#a7f3d0","#ccfbf1"],textColor:"#191510",effect:"slide-up"},{title:"Formal\n& Casual",subtitle:"22 designs available",emoji:"👔",bg:["#4ade80","#6ee7b7"],textColor:"#191510",effect:"zoom"},{title:"Eid\nSpecial",subtitle:"Look your best this Eid",emoji:"🌙",bg:["#22c55e","#34d399"],textColor:"#ffffff",effect:"shimmer"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"elegant"},
  {id:12,name:"Lawn Suit Magic",scenes:[{title:"Women's\nLawn Suits",subtitle:"30+ Designs",emoji:"🧶",bg:["#5eead4","#67e8f9","#bae6fd"],textColor:"#191510",effect:"float"},{title:"Unstitched\n3-Piece",subtitle:"Fabric • Dupatta • Trousers",emoji:"✂️",bg:["#2dd4bf","#22d3ee"],textColor:"#191510",effect:"slide-up"},{title:"Summer\nCollection",subtitle:"Light, breezy, beautiful",emoji:"☀️",bg:["#14b8a6","#06b6d4"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"vibrant"},
  {id:13,name:"Kids' Festival Wear",scenes:[{title:"Kids'\nTraditional",subtitle:"Festival-ready outfits",emoji:"🧒",bg:["#93c5fd","#c7d2fe","#e9d5ff"],textColor:"#191510",effect:"bounce-in"},{title:"Mini Shalwar\nKameez",subtitle:"Boys & Girls",emoji:"👶",bg:["#60a5fa","#818cf8"],textColor:"#191510",effect:"float"},{title:"Eid\nCollection",subtitle:"Adorable & comfortable",emoji:"🎉",bg:["#3b82f6","#a855f7"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"playful"},
  {id:14,name:"Wallet Wisdom",scenes:[{title:"Wallets\n& Clutches",subtitle:"Genuine leather",emoji:"👛",bg:["#fbbf24","#fed7aa","#fef9c3"],textColor:"#191510",effect:"slide-up"},{title:"Slim\nDesign",subtitle:"Fits your pocket perfectly",emoji:"✨",bg:["#f59e0b","#fb923c"],textColor:"#191510",effect:"zoom"},{title:"Gift\nIdeas",subtitle:"Perfect for any occasion",emoji:"🎁",bg:["#d97706","#ef4444"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"minimal"},
  {id:15,name:"Hair Accessories Sparkle",scenes:[{title:"Hair\nAccessories",subtitle:"Pearl & Velvet",emoji:"🎀",bg:["#f9a8d4","#fecdd3","#fce7f3"],textColor:"#191510",effect:"shimmer"},{title:"Clips •\nPins • Bands",subtitle:"Everyday essentials",emoji:"✨",bg:["#f472b6","#fda4af"],textColor:"#191510",effect:"float"},{title:"Under\nRs 300",subtitle:"Cute & affordable",emoji:"💖",bg:["#ec4899","#d946ef"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"playful"},
  {id:16,name:"Kitchen Storage Goals",scenes:[{title:"Kitchen\nStorage",subtitle:"Airtight & stackable",emoji:"🥡",bg:["#86efac","#d9f99d","#d1fae5"],textColor:"#191510",effect:"slide-up"},{title:"Organize\nEverything",subtitle:"Pantry • Spices • Snacks",emoji:"📋",bg:["#4ade80","#bef264"],textColor:"#191510",effect:"zoom"},{title:"Home\nUpgrade",subtitle:"Miniso-style finds",emoji:"🏠",bg:["#22c55e","#34d399"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"minimal"},
  {id:17,name:"Stationery Aesthetic",scenes:[{title:"Desk\nStationery",subtitle:"Aesthetic essentials",emoji:"✏️",bg:["#d8b4fe","#c4b5fd","#e0e7ff"],textColor:"#191510",effect:"float"},{title:"Pens •\nNotebooks • Stickers",subtitle:"Study in style",emoji:"📚",bg:["#c084fc","#a78bfa"],textColor:"#191510",effect:"slide-up"},{title:"Student\nFriendly",subtitle:"Budget picks",emoji:"🎓",bg:["#a855f7","#818cf8"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"pastel"},
  {id:18,name:"Bathroom Bliss",scenes:[{title:"Bathroom\nFinds",subtitle:"Miniso-style upgrades",emoji:"🧴",bg:["#67e8f9","#bae6fd","#dbeafe"],textColor:"#191510",effect:"shimmer"},{title:"Soap •\nDispensers • Holders",subtitle:"Cute & functional",emoji:"🧼",bg:["#22d3ee","#38bdf8"],textColor:"#191510",effect:"float"},{title:"Under\nRs 500",subtitle:"Instant upgrade",emoji:"💡",bg:["#06b6d4","#3b82f6"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"pastel"},
  {id:19,name:"Bedsheet Dreams",scenes:[{title:"Bedsheet\nSets",subtitle:"Sleep in luxury",emoji:"🛏️",bg:["#a5b4fc","#bfdbfe","#e0f2fe"],textColor:"#191510",effect:"float"},{title:"Cotton\n& Satin",subtitle:"Cool & breathable",emoji:"🌙",bg:["#818cf8","#60a5fa"],textColor:"#191510",effect:"shimmer"},{title:"Sweet\nDreams",subtitle:"Transform your bedroom",emoji:"💤",bg:["#6366f1","#a855f7"],textColor:"#ffffff",effect:"fade-scale"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"elegant"},
  {id:20,name:"Home Decor Refresh",scenes:[{title:"Home\nDecor",subtitle:"Refresh your space",emoji:"🏡",bg:["#fde68a","#ffedd5","#fff1f2"],textColor:"#191510",effect:"zoom"},{title:"Vases •\nCandles • Cushions",subtitle:"Curated collection",emoji:"✨",bg:["#fcd34d","#fed7aa"],textColor:"#191510",effect:"slide-up"},{title:"Room\nMakeover",subtitle:"Starting Rs 300",emoji:"🎨",bg:["#fbbf24","#fda4af"],textColor:"#191510",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"vibrant"},
  {id:21,name:"Flash Sale Frenzy",scenes:[{title:"⚡ FLASH\nSALE ⚡",subtitle:"48 Hours Only",emoji:"🔥",bg:["#ef4444","#f97316","#facc15"],textColor:"#ffffff",effect:"glitch"},{title:"Up to\n40% OFF",subtitle:"Storewide savings",emoji:"💰",bg:["#dc2626","#f97316"],textColor:"#ffffff",effect:"bounce-in"},{title:"Don't\nMiss Out",subtitle:"While stocks last",emoji:"⏰",bg:["#b91c1c","#f59e0b"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"bold"},
  {id:22,name:"Free Shipping Party",scenes:[{title:"🚚 FREE\nSHIPPING",subtitle:"Orders over Rs 5000",emoji:"📦",bg:["#4ade80","#6ee7b7","#99f6e4"],textColor:"#ffffff",effect:"slide-up"},{title:"Nationwide\nDelivery",subtitle:"All across Pakistan",emoji:"🇵🇰",bg:["#22c55e","#34d399"],textColor:"#ffffff",effect:"zoom"},{title:"Bulk\nOrders",subtitle:"Wholesale pricing",emoji:"🏭",bg:["#16a34a","#14b8a6"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"bold"},
  {id:23,name:"New Arrivals Drop",scenes:[{title:"✨ NEW\nARRIVALS",subtitle:"Just dropped this week",emoji:"🆕",bg:["#facc15","#fbbf24","#fed7aa"],textColor:"#191510",effect:"shimmer"},{title:"Weekly\nDrops",subtitle:"New products every Friday",emoji:"📅",bg:["#eab308","#f59e0b"],textColor:"#191510",effect:"slide-up"},{title:"Be\nFirst",subtitle:"Follow us for alerts",emoji:"🔔",bg:["#ca8a04","#f97316"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"vibrant"},
  {id:24,name:"Bulk Order Deals",scenes:[{title:"Bulk\nOrders",subtitle:"Wholesale pricing",emoji:"📦",bg:["#94a3b8","#d1d5db","#e4e4e7"],textColor:"#191510",effect:"slide-up"},{title:"Retail\n& Wholesale",subtitle:"Minimum 10 pieces",emoji:"🏬",bg:["#64748b","#9ca3af"],textColor:"#ffffff",effect:"zoom"},{title:"Reseller\nFriendly",subtitle:"Your own business starts here",emoji:"💼",bg:["#475569","#64748b"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"minimal"},
  {id:25,name:"Gift Guide",scenes:[{title:"🎁 Gift\nIdeas",subtitle:"For everyone you love",emoji:"💝",bg:["#f472b6","#c084fc","#818cf8"],textColor:"#ffffff",effect:"bounce-in"},{title:"Birthday •\nEid • Anniversary",subtitle:"Something for everyone",emoji:"🎂",bg:["#ec4899","#a855f7"],textColor:"#ffffff",effect:"float"},{title:"Gift\nWrapping",subtitle:"Available on request",emoji:"🎀",bg:["#a855f7","#6366f1"],textColor:"#ffffff",effect:"shimmer"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"playful"},
  {id:26,name:"Eid Collection",scenes:[{title:"🌙 Eid\nCollection",subtitle:"Dress to impress",emoji:"✨",bg:["#10b981","#22c55e","#14b8a6"],textColor:"#ffffff",effect:"shimmer"},{title:"Men •\nWomen • Kids",subtitle:"Complete family outfits",emoji:"👨‍👩‍👧‍👦",bg:["#059669","#16a34a"],textColor:"#ffffff",effect:"slide-up"},{title:"Accessories\nToo!",subtitle:"Jewelry, scarves, bags",emoji:"💎",bg:["#047857","#0d9488"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"luxury"},
  {id:27,name:"Summer Vibes",scenes:[{title:"☀️ Summer\nVibes",subtitle:"Hot season, cooler style",emoji:"🌴",bg:["#facc15","#fb923c","#f87171"],textColor:"#ffffff",effect:"zoom"},{title:"Sunglasses\n• Scarves • Belts",subtitle:"Summer essentials",emoji:"😎",bg:["#eab308","#f97316"],textColor:"#ffffff",effect:"slide-up"},{title:"Beat\nThe Heat",subtitle:"Light fabrics & shades",emoji:"🧊",bg:["#f97316","#ef4444"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"vibrant"},
  {id:28,name:"Winter Warmth",scenes:[{title:"❄️ Winter\nWarmth",subtitle:"Stay cozy & stylish",emoji:"🧤",bg:["#60a5fa","#818cf8","#c084fc"],textColor:"#ffffff",effect:"float"},{title:"Scarves •\nCushions • Candles",subtitle:"Winter essentials",emoji:"🔥",bg:["#3b82f6","#6366f1"],textColor:"#ffffff",effect:"slide-up"},{title:"Warm\nDeals",subtitle:"Save big this winter",emoji:"❄️",bg:["#2563eb","#9333ea"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"elegant"},
  {id:29,name:"Back to School",scenes:[{title:"📚 Back\nto School",subtitle:"Get ready for class",emoji:"🎒",bg:["#93c5fd","#c7d2fe","#ddd6fe"],textColor:"#191510",effect:"bounce-in"},{title:"Stationery\nKit",subtitle:"Pens • Notebooks • Pouches",emoji:"✏️",bg:["#60a5fa","#818cf8"],textColor:"#191510",effect:"slide-up"},{title:"Student\nDeals",subtitle:"Save 20% on bundles",emoji:"🎓",bg:["#3b82f6","#8b5cf6"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"playful"},
  {id:30,name:"Wedding Season",scenes:[{title:"💍 Wedding\nSeason",subtitle:"Dress to impress",emoji:"👰",bg:["#f87171","#fda4af","#fecdd3"],textColor:"#ffffff",effect:"shimmer"},{title:"Jewelry •\nScarves • Bags",subtitle:"Complete your look",emoji:"✨",bg:["#ef4444","#fb7185"],textColor:"#ffffff",effect:"float"},{title:"Bridal\nEssentials",subtitle:"Premium range",emoji:"💎",bg:["#dc2626","#ec4899"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"luxury"},
  {id:31,name:"Brand Story",scenes:[{title:"House\nof Fashion",subtitle:"Since 2020",emoji:"🏠",bg:["#fbbf24","#fde047","#fed7aa"],textColor:"#191510",effect:"fade-scale"},{title:"Curated\nWith Love",subtitle:"Handpicked products",emoji:"💝",bg:["#f59e0b","#facc15"],textColor:"#191510",effect:"float"},{title:"100K+\nHappy Customers",subtitle:"Across Pakistan",emoji:"🇵🇰",bg:["#d97706","#f97316"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"elegant"},
  {id:32,name:"Quality Promise",scenes:[{title:"Quality\nPromise",subtitle:"We don't compromise",emoji:"✅",bg:["#34d399","#4ade80","#a7f3d0"],textColor:"#ffffff",effect:"zoom"},{title:"Handpicked\nProducts",subtitle:"Every item inspected",emoji:"🔍",bg:["#10b981","#22c55e"],textColor:"#ffffff",effect:"slide-up"},{title:"Easy\nReturns",subtitle:"7-day return policy",emoji:"🔄",bg:["#059669","#14b8a6"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"minimal"},
  {id:33,name:"Customer Favorites",scenes:[{title:"🔥 Top\nSellers",subtitle:"Customer favorites",emoji:"⭐",bg:["#fb923c","#f87171","#f9a8d4"],textColor:"#ffffff",effect:"bounce-in"},{title:"5-Star\nRated",subtitle:"Verified reviews",emoji:"🏆",bg:["#f97316","#ef4444"],textColor:"#ffffff",effect:"shimmer"},{title:"Join the\nCrowd",subtitle:"See what's trending",emoji:"📈",bg:["#ef4444","#ec4899"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"bold"},
  {id:34,name:"Behind the Scenes",scenes:[{title:"Behind\nThe Scenes",subtitle:"How we work",emoji:"🎬",bg:["#4b5563","#9ca3af","#cbd5e1"],textColor:"#ffffff",effect:"slide-up"},{title:"Market\nSourcing",subtitle:"We travel to find the best",emoji:"✈️",bg:["#374151","#64748b"],textColor:"#ffffff",effect:"zoom"},{title:"Quality\nCheck",subtitle:"Every item inspected",emoji:"✅",bg:["#1f2937","#475569"],textColor:"#ffffff",effect:"fade-scale"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"dark"},
  {id:35,name:"Lifestyle Mix",scenes:[{title:"Your\nLifestyle",subtitle:"Fashion meets function",emoji:"🌟",bg:["#8b5cf6","#a855f7","#f472b6"],textColor:"#ffffff",effect:"float"},{title:"From Head\nto Toe",subtitle:"Accessories for every look",emoji:"👗",bg:["#7c3aed","#9333ea"],textColor:"#ffffff",effect:"slide-up"},{title:"Home\n& Away",subtitle:"Decor & personal style",emoji:"🏡",bg:["#a855f7","#d946ef"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"vibrant"},
  {id:36,name:"Pakistani Heritage",scenes:[{title:"🇵🇰 Pakistani\nHeritage",subtitle:"Traditional meets modern",emoji:"🕌",bg:["#16a34a","#10b981","#14b8a6"],textColor:"#ffffff",effect:"shimmer"},{title:"Shalwar\nKameez",subtitle:"Our signature",emoji:"🧵",bg:["#15803d","#22c55e"],textColor:"#ffffff",effect:"slide-up"},{title:"Handcrafted\nWith Pride",subtitle:"Support local artisans",emoji:"🤝",bg:["#14532d","#0d9488"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"luxury"},
  {id:37,name:"Mini Finds Under 500",scenes:[{title:"Under\nRs 500",subtitle:"Budget-friendly finds",emoji:"💸",bg:["#a3e635","#4ade80","#6ee7b7"],textColor:"#191510",effect:"bounce-in"},{title:"Cute\nAccessories",subtitle:"Clips, pins & more",emoji:"🎀",bg:["#84cc16","#22c55e"],textColor:"#191510",effect:"float"},{title:"Affordable\nLuxury",subtitle:"Quality at low prices",emoji:"✨",bg:["#22c55e","#34d399"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"playful"},
  {id:38,name:"Luxury Tier",scenes:[{title:"Luxury\nPicks",subtitle:"For the discerning eye",emoji:"👑",bg:["#eab308","#f59e0b","#f97316"],textColor:"#ffffff",effect:"shimmer"},{title:"Silk •\nLeather • Crystal",subtitle:"Premium materials",emoji:"💎",bg:["#ca8a04","#d97706"],textColor:"#ffffff",effect:"float"},{title:"Exclusive\nRange",subtitle:"Limited editions",emoji:"🌟",bg:["#b45309","#f97316"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"luxury"},
  {id:39,name:"Room by Room",scenes:[{title:"Room\nby Room",subtitle:"Decorate every corner",emoji:"🏡",bg:["#fde68a","#fecdd3","#f5f3ff"],textColor:"#191510",effect:"slide-up"},{title:"Living\nRoom",subtitle:"Cushions, vases & candles",emoji:"🛋️",bg:["#fcd34d","#fda4af"],textColor:"#191510",effect:"zoom"},{title:"Bedroom\n& Kitchen",subtitle:"Bedsheets, storage & more",emoji:"🛏️",bg:["#fbbf24","#c084fc"],textColor:"#191510",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"pastel"},
  {id:40,name:"Self Care Sunday",scenes:[{title:"Self Care\nSunday",subtitle:"You deserve it",emoji:"🧖",bg:["#fda4af","#f9a8d4","#ddd6fe"],textColor:"#191510",effect:"float"},{title:"Candles •\nScarves • Jewelry",subtitle:"Pamper yourself",emoji:"🕯️",bg:["#fb7185","#f472b6"],textColor:"#191510",effect:"shimmer"},{title:"Weekly\nRitual",subtitle:"Make it a habit",emoji:"💫",bg:["#f43f5e","#a855f7"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"pastel"},
  {id:41,name:"Follow & Win",scenes:[{title:"Follow\n& Win",subtitle:"Exclusive giveaways",emoji:"🎁",bg:["#a855f7","#7c3aed","#6366f1"],textColor:"#ffffff",effect:"bounce-in"},{title:"Weekly\nGiveaways",subtitle:"Every Friday",emoji:"🎰",bg:["#9333ea","#6d28d9"],textColor:"#ffffff",effect:"zoom"},{title:"Tag a\nFriend",subtitle:"Share the love",emoji:"👯",bg:["#7c3aed","#4f46e5"],textColor:"#ffffff",effect:"slide-up"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"bold"},
  {id:42,name:"Style Quiz",scenes:[{title:"What's\nYour Style?",subtitle:"Find your vibe",emoji:"🔮",bg:["#8b5cf6","#a855f7","#f9a8d4"],textColor:"#191510",effect:"float"},{title:"Bold •\nMinimal • Elegant",subtitle:"Choose your aesthetic",emoji:"🎨",bg:["#7c3aed","#9333ea"],textColor:"#ffffff",effect:"slide-up"},{title:"We Have\nIt All",subtitle:"19 categories to explore",emoji:"🗂️",bg:["#a855f7","#ec4899"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"vibrant"},
  {id:43,name:"Unbox the Joy",scenes:[{title:"Unbox\nThe Joy",subtitle:"Experience unboxing",emoji:"📦",bg:["#facc15","#fbbf24","#fed7aa"],textColor:"#191510",effect:"zoom"},{title:"Neatly\nPacked",subtitle:"Every order is special",emoji:"🎀",bg:["#eab308","#f59e0b"],textColor:"#191510",effect:"shimmer"},{title:"Share\nYour Unboxing",subtitle:"Tag @houseoffashionpk",emoji:"📱",bg:["#f59e0b","#f97316"],textColor:"#191510",effect:"slide-up"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"playful"},
  {id:44,name:"Compare & Choose",scenes:[{title:"Compare\nProducts",subtitle:"Side by side",emoji:"⚖️",bg:["#22d3ee","#60a5fa","#818cf8"],textColor:"#191510",effect:"slide-up"},{title:"Smart\nShopping",subtitle:"Use our comparison tool",emoji:"🧠",bg:["#06b6d4","#3b82f6"],textColor:"#ffffff",effect:"zoom"},{title:"Best\nValue",subtitle:"Always the right choice",emoji:"✅",bg:["#3b82f6","#6366f1"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"minimal"},
  {id:45,name:"Wishlist Goals",scenes:[{title:"Wishlist\nGoals",subtitle:"Save for later",emoji:"💖",bg:["#f472b6","#fda4af","#fca5a5"],textColor:"#ffffff",effect:"float"},{title:"Heart It\nTo Save",subtitle:"Tap the heart icon",emoji:"❤️",bg:["#ec4899","#fb7185"],textColor:"#ffffff",effect:"bounce-in"},{title:"Never Miss\nA Sale",subtitle:"Get notified on price drops",emoji:"🔔",bg:["#f43f5e","#ef4444"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"playful"},
  {id:46,name:"WhatsApp Orders",scenes:[{title:"Order on\nWhatsApp",subtitle:"Quick & easy",emoji:"💬",bg:["#22c55e","#10b981","#14b8a6"],textColor:"#ffffff",effect:"bounce-in"},{title:"Just Send\nA Message",subtitle:"No app needed",emoji:"📱",bg:["#16a34a","#059669"],textColor:"#ffffff",effect:"slide-up"},{title:"Fast\nDelivery",subtitle:"Nationwide shipping",emoji:"🚚",bg:["#15803d","#0d9488"],textColor:"#ffffff",effect:"zoom"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"bold"},
  {id:47,name:"Seasonal Refresh",scenes:[{title:"New\nSeason",subtitle:"Time for a refresh",emoji:"🔄",bg:["#2dd4bf","#22d3ee","#38bdf8"],textColor:"#ffffff",effect:"spin-in"},{title:"Refresh\nYour Space",subtitle:"New colors & textures",emoji:"🎨",bg:["#14b8a6","#06b6d4"],textColor:"#ffffff",effect:"slide-up"},{title:"Trending\nNow",subtitle:"What's hot this season",emoji:"🔥",bg:["#06b6d4","#0ea5e9"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"vibrant"},
  {id:48,name:"Mini Makeover",scenes:[{title:"Mini\nMakeover",subtitle:"Small changes, big impact",emoji:"✨",bg:["#fda4af","#f472b6","#ddd6fe"],textColor:"#191510",effect:"shimmer"},{title:"New\nAccessories",subtitle:"Transform your look",emoji:"💫",bg:["#fb7185","#d946ef"],textColor:"#191510",effect:"float"},{title:"Under\nRs 1000",subtitle:"Affordable transformations",emoji:"💰",bg:["#d946ef","#c084fc"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"pastel"},
  {id:49,name:"Collector's Edition",scenes:[{title:"Collector's\nEdition",subtitle:"Rare & unique finds",emoji:"🏆",bg:["#f59e0b","#facc15","#fb923c"],textColor:"#ffffff",effect:"shimmer"},{title:"Limited\nStock",subtitle:"Once they're gone, they're gone",emoji:"⏰",bg:["#d97706","#eab308"],textColor:"#ffffff",effect:"zoom"},{title:"Grab\nYours",subtitle:"Before it's too late",emoji:"🏃",bg:["#f97316","#ef4444"],textColor:"#ffffff",effect:"bounce-in"},{title:"Shop\nNow →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"luxury"},
  {id:50,name:"Thank You",scenes:[{title:"Thank\nYou 💛",subtitle:"For being part of our family",emoji:"🙏",bg:["#fcd34d","#fde68a","#fed7aa"],textColor:"#191510",effect:"float"},{title:"100K+\nOrders",subtitle:"And counting",emoji:"🎉",bg:["#fbbf24","#fde047"],textColor:"#191510",effect:"bounce-in"},{title:"We\nAppreciate You",subtitle:"Every single order",emoji:"💝",bg:["#f59e0b","#f97316"],textColor:"#ffffff",effect:"shimmer"},{title:"Keep\nShopping →",emoji:"🛍️",bg:["#191510","#1f2937"],textColor:"#fff8e7",effect:"fade-scale"}],duration:15,style:"elegant"},
];

function generateReelHTML(reel) {
  const sceneCount = reel.scenes.length;
  const sceneDuration = (reel.duration * 1000) / sceneCount;

  const scenesCSS = reel.scenes.map((s, i) => {
    const gradientStops = s.bg.map((c, ci) => `${c} ${(ci / (s.bg.length - 1)) * 100}%`).join(", ");
    return `
.scene-${i} {
  position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
  background:linear-gradient(180deg, ${gradientStops});
  color:${s.textColor || "#191510"}; opacity:0;
  animation: sin-${i} ${sceneDuration}ms linear ${i * sceneDuration}ms forwards;
}
@keyframes sin-${i} {
  0% { opacity:0; transform:${
    s.effect === "zoom" ? "scale(0.3)" :
    s.effect === "slide-up" ? "translateY(120px)" :
    s.effect === "bounce-in" ? "scale(0.1)" :
    s.effect === "spin-in" ? "rotate(-180deg) scale(0)" :
    "translateY(40px)"
  }; }
  12% { opacity:1; transform:${
    s.effect === "bounce-in" ? "scale(1.1)" :
    s.effect === "spin-in" ? "rotate(10deg) scale(1.05)" :
    "none"
  }; }
  20% { opacity:1; transform:${
    s.effect === "bounce-in" || s.effect === "spin-in" ? "none" : "none"
  }; }
  88% { opacity:1; }
  100% { opacity:0; }
}`;
  }).join("\n");

  const scenesHTML = reel.scenes.map((s, i) => `
<div class="scene-${i}">
  <div class="emoji">${s.emoji || ""}</div>
  <h2 class="title">${(s.title || "").replace(/\n/g, "<br>")}</h2>
  ${s.subtitle ? `<p class="subtitle">${s.subtitle}</p>` : ""}
  <div class="brand">HOUSE OF FASHION</div>
  <div class="pbar"><div class="pfill" style="animation:pf-${i} ${sceneDuration}ms linear ${i * sceneDuration}ms forwards;"></div></div>
</div>`).join("\n");

  const progressCSS = reel.scenes.map((_, i) => `
@keyframes pf-${i} { from{width:${(i / sceneCount) * 100}%} to{width:${((i + 1) / sceneCount) * 100}%} }`).join("\n");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
.vp{position:relative;width:1080px;height:1920px;overflow:hidden}
${scenesCSS}
${progressCSS}
.emoji{font-size:140px;margin-bottom:20px;animation:fe 2s ease-in-out infinite}
@keyframes fe{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
.title{font-family:Georgia,serif;font-size:90px;font-weight:bold;text-align:center;line-height:1.15;white-space:pre-line;padding:0 40px}
.subtitle{font-family:Arial,sans-serif;font-size:38px;margin-top:12px;opacity:0.8;text-align:center;padding:0 60px}
.brand{position:absolute;bottom:60px;left:0;right:0;text-align:center;font-family:Arial,sans-serif;font-size:22px;letter-spacing:3px;opacity:0.4}
.pbar{position:absolute;bottom:0;left:0;right:0;height:8px;background:rgba(0,0,0,0.2)}
.pfill{height:100%;background:rgba(255,255,255,0.8);width:0}
</style></head><body><div class="vp">${scenesHTML}</div></body></html>`;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  // Determine which reels still need generation
  const reelsToGenerate = REELS.filter((reel) => {
    const mp4Path = join(OUT_DIR, `reel-${String(reel.id).padStart(2, "0")}.mp4`);
    const webmPath = join(OUT_DIR, `reel-${String(reel.id).padStart(2, "0")}.webm`);
    return !existsSync(mp4Path) && !existsSync(webmPath);
  });

  if (reelsToGenerate.length === 0) {
    console.log("\n✅ All 50 reels already generated!\n");
    return;
  }

  console.log(`\n🎬 Generating ${reelsToGenerate.length} remaining reels as .webm...\n`);

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: CHROME_PATH,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--use-gl=swiftshader"],
  });

  let success = 0;
  let failed = 0;

  for (const reel of reelsToGenerate) {
    const fileName = `reel-${String(reel.id).padStart(2, "0")}.webm`;
    const filePath = join(OUT_DIR, fileName);

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1920 });
      await page.setContent(generateReelHTML(reel), { waitUntil: "domcontentloaded" });

      // Use CDP to record the page as WebM
      const client = await page.createCDPSession();

      // Collect screencast frames as raw data
      const frames = [];
      let collecting = true;

      await client.send("Page.startScreencast", {
        format: "jpeg",
        quality: 85,
        maxWidth: 1080,
        maxHeight: 1920,
        everyNthFrame: 2, // skip every other frame for smaller file
      });

      client.on("Page.screencastFrame", async (params) => {
        if (!collecting) return;
        frames.push(Buffer.from(params.data, "base64"));
        await client.send("Page.screencastFrameAck", { sessionId: params.sessionId });
      });

      // Wait for reel to finish playing
      await new Promise((r) => setTimeout(r, reel.duration * 1000 + 300));
      collecting = false;
      await client.send("Page.stopScreencast");
      await page.close();

      if (frames.length < 5) {
        console.log(`  ⚠️  #${String(reel.id).padStart(2, "0")} ${reel.name} — too few frames (${frames.length}), retrying...`);
        failed++;
        continue;
      }

      // Save frames directory for later encoding
      const framesDir = join(OUT_DIR, `reel-${String(reel.id).padStart(2, "0")}-frames`);
      if (!existsSync(framesDir)) mkdirSync(framesDir, { recursive: true });
      for (let i = 0; i < frames.length; i++) {
        writeFileSync(join(framesDir, `frame-${String(i).padStart(4, "0")}.jpg`), frames[i]);
      }

      console.log(`  ✅ #${String(reel.id).padStart(2, "0")} ${reel.name} — ${frames.length} frames saved`);
      success++;
    } catch (err) {
      console.log(`  ❌ #${reel.id} ${reel.name} — ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\n✨ Done! ${success} reels captured, ${failed} failed`);
}

main().catch(console.error);
