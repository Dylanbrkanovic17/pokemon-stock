import { computeMargin } from "@/lib/margin";
import { formatCents } from "@/lib/money";
import type { Product } from "@/generated/prisma/client";

export function MarginBadge({ product }: { product: Product }) {
  const margin = computeMargin(product);

  if (margin.kind === "none") {
    return <span className="text-zinc-400 text-sm">—</span>;
  }

  if (margin.kind === "cross-currency") {
    return (
      <span className="text-sm text-zinc-500" title="Compra y precio de referencia en monedas distintas">
        {formatCents(margin.purchaseCents, margin.purchaseCurrency)} compra /{" "}
        {formatCents(margin.referenceCents, margin.referenceCurrency)} Cardmarket
      </span>
    );
  }

  const positive = margin.amountCents >= 0;
  return (
    <span
      className={`text-sm font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}
      title={margin.source === "cardmarket" ? "Basado en precio Cardmarket" : "Basado en precio de venta"}
    >
      {positive ? "+" : ""}
      {formatCents(margin.amountCents, margin.currency)}
    </span>
  );
}
