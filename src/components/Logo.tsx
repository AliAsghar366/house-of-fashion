import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110"
      >
        <circle cx="20" cy="20" r="18.5" fill="var(--color-primary)" stroke="var(--color-ink)" strokeWidth="2" />
        <path
          d="M14 23V13.5L20 9l6 4.5V23c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2Z"
          fill="var(--color-cream)"
          stroke="var(--color-ink)"
          strokeWidth="1.4"
        />
        <circle cx="20" cy="18" r="2.2" fill="var(--color-ink)" />
        <path d="M14 23h12" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="font-display text-2xl leading-none tracking-tight text-ink dark:text-cream">
        House <span className="text-secondary">of</span> Fashion
      </span>
    </Link>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="18.5" fill="var(--color-primary)" stroke="var(--color-ink)" strokeWidth="2" />
      <path
        d="M14 23V13.5L20 9l6 4.5V23c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2Z"
        fill="var(--color-cream)"
        stroke="var(--color-ink)"
        strokeWidth="1.4"
      />
      <circle cx="20" cy="18" r="2.2" fill="var(--color-ink)" />
    </svg>
  );
}
