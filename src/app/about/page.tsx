import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Package, Users } from "lucide-react";

export const metadata = { title: "About Us — House of Fashion" };

const values = [
  { icon: Sparkles, title: "Playfully Curated", desc: "Every piece is picked for personality first, practicality second." },
  { icon: Heart, title: "Made to Be Loved", desc: "Quality materials that hold up long after the trend cycle moves on." },
  { icon: Package, title: "Wholesale Friendly", desc: "Bulk pricing on every product, whether you're buying one or one hundred." },
  { icon: Users, title: "Built for Pakistan", desc: "PKR pricing, nationwide shipping, and support that gets it." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-lavender">
        <div className="absolute -top-10 -right-10 h-48 w-48 bg-primary/20 blob animate-float" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center relative">
          <h1 className="font-display text-4xl sm:text-5xl">
            We&apos;re House <span className="text-ink">of</span> Fashion
          </h1>
          <p className="mt-4 text-lg text-ink/70 max-w-2xl mx-auto">
            A Karachi-born accessories and home decor brand for people who
            treat their vibe like a full-time creative project — fashion
            accessories, plush cushions, and fragrances that actually smell
            expensive.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="relative grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <Image src="/images/products/jewelry/4.jpg" alt="Jewelry" fill className="object-cover" sizes="300px" />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg mt-8">
            <Image src="/images/products/candles/2.jpg" alt="Candles" fill className="object-cover" sizes="300px" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl">Our Story</h2>
          <p className="mt-4 text-ink/70 leading-relaxed">
            House of Fashion started as a single stall obsession: why does
            &quot;home decor&quot; always feel so serious, and why does
            &quot;fashion&quot; forget your living room exists? We wanted one
            place for both — cushions that match your mood, perfume that
            matches your personality, and accessories that don&apos;t take
            themselves too seriously.
          </p>
          <p className="mt-4 text-ink/70 leading-relaxed">
            Today we stock over a hundred products across twelve niches, all
            priced in PKR with bulk options for resellers, gifting, and
            anyone who simply cannot buy just one.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Explore the Catalog <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="bg-ink text-cream py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl text-center mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg bg-cream/5 p-5">
                <div className="inline-flex rounded-xl bg-primary/20 p-2.5 text-ink mb-3">
                  <v.icon size={22} />
                </div>
                <h3 className="font-display text-lg">{v.title}</h3>
                <p className="mt-1 text-sm text-cream/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
