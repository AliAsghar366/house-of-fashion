"use client";

import { useState } from "react";
import { Phone, Mail, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl sm:text-5xl">Let&apos;s Talk</h1>
        <p className="mt-2 text-ink/60">
          Questions about an order, bulk pricing, or just want to say hi?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <InfoCard
            icon={<Phone size={20} />}
            title="WhatsApp"
            lines={["+92 312 0744554", "Chat with us anytime!"]}
            href="https://wa.me/923120744554"
          />
          <InfoCard icon={<Mail size={20} />} title="Email Us" lines={["hello@houseoffashion.pk", "support@houseoffashion.pk"]} />
          <InfoCard icon={<Clock size={20} />} title="Hours" lines={["Mon – Sat: 11am – 9pm", "Sunday: 1pm – 7pm"]} />
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-lg border-2 border-ink/10 bg-white p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="rounded-full bg-mint p-4 mb-4">
                  <Check size={28} className="text-ink" />
                </div>
                <h2 className="font-display text-2xl">Message sent!</h2>
                <p className="mt-2 text-ink/60">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Your Name" placeholder="Full name" required />
                  <Field label="Email" placeholder="you@example.com" type="email" required />
                </div>
                <Field label="Subject" placeholder="What's this about?" />
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, lines, href }: { icon: React.ReactNode; title: string; lines: string[]; href?: string }) {
  const content = (
    <div className="flex gap-3 rounded-lg border-2 border-ink/10 bg-white p-4">
      <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-ink h-fit">{icon}</div>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        {lines.map((l) => (
          <p key={l} className="text-sm text-ink/60">{l}</p>
        ))}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:-translate-y-0.5 transition-transform">
        {content}
      </a>
    );
  }
  return content;
}

function Field({
  label,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold mb-1.5 block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
