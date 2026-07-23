"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  qty,
  onChange,
  min = 1,
}: {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border-2 border-ink/15 bg-white">
      <button
        onClick={() => onChange(Math.max(min, qty - 1))}
        className="rounded-full p-2.5 hover:bg-primary/10 transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        value={qty}
        min={min}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!Number.isNaN(v)) onChange(Math.max(min, v));
        }}
        className="w-12 bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => onChange(qty + 1)}
        className="rounded-full p-2.5 hover:bg-primary/10 transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
