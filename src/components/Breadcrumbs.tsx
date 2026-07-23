import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center flex-wrap gap-1 text-xs text-ink/65 mb-4">
      <Link href="/" className="hover:text-ink transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} />
          {item.href ? (
            <Link href={item.href} className="hover:text-ink transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink/70 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
