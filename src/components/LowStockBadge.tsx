export function isLowStock(quantity: number, threshold: number | null, defaultThreshold: number): boolean {
  return quantity < (threshold ?? defaultThreshold);
}

export function LowStockBadge({ low }: { low: boolean }) {
  if (!low) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      Stock bajo
    </span>
  );
}
