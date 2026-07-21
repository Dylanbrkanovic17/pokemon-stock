import Link from "next/link";
import type { Product } from "@/generated/prisma/client";
import { formatCents } from "@/lib/money";
import { productTypeLabels } from "@/lib/labels";
import { MarginBadge } from "@/components/MarginBadge";
import { LowStockBadge, isLowStock } from "@/components/LowStockBadge";

export function ProductTable({
  products,
  defaultThreshold,
}: {
  products: Product[];
  defaultThreshold: number;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
        No hay productos todavía.{" "}
        <Link href="/products/new" className="font-medium text-zinc-900 underline">
          Añade el primero
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-2">Producto</th>
            <th className="px-4 py-2">Set</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2 text-right">Stock</th>
            <th className="px-4 py-2 text-right">Compra</th>
            <th className="px-4 py-2 text-right">Venta / Mercado</th>
            <th className="px-4 py-2 text-right">Margen</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {products.map((product) => {
            const low = isLowStock(product.quantity, product.lowStockThreshold, defaultThreshold);
            const referencePrice =
              product.salePriceCents != null
                ? formatCents(product.salePriceCents, product.currency)
                : product.cardmarketPriceCents != null
                  ? `${formatCents(product.cardmarketPriceCents, "EUR")} (Cardmarket)`
                  : "—";
            return (
              <tr key={product.id} className={low ? "bg-amber-50/60" : undefined}>
                <td className="px-4 py-2">
                  <Link href={`/products/${product.id}`} className="font-medium text-zinc-900 hover:underline">
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-zinc-600">{product.set}</td>
                <td className="px-4 py-2 text-zinc-600">{productTypeLabels[product.productType]}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {product.quantity}
                    <LowStockBadge low={low} />
                  </div>
                </td>
                <td className="px-4 py-2 text-right text-zinc-600">
                  {formatCents(product.purchasePriceCents, product.currency)}
                </td>
                <td className="px-4 py-2 text-right text-zinc-600">{referencePrice}</td>
                <td className="px-4 py-2 text-right">
                  <MarginBadge product={product} />
                </td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/products/${product.id}`} className="text-zinc-500 hover:text-zinc-900">
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
