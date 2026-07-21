"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/generated/prisma/client";
import { formatCents } from "@/lib/money";

export function CardmarketPriceRefresh({ product }: { product: Product }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!product.cardmarketProductId) {
    return (
      <p className="text-sm text-zinc-500">
        Añade un ID de producto Cardmarket arriba para poder consultar su precio de mercado.
      </p>
    );
  }

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/products/${product.id}/refresh-price`, { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(typeof data?.error === "string" ? data.error : "No se pudo actualizar el precio");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md bg-zinc-50 px-3 py-2 text-sm">
      <span className="text-zinc-600">
        Precio Cardmarket:{" "}
        {product.cardmarketPriceCents != null ? (
          <strong className="text-zinc-900">{formatCents(product.cardmarketPriceCents, "EUR")}</strong>
        ) : (
          "—"
        )}
        {product.cardmarketPriceUpdatedAt && (
          <span className="text-zinc-400">
            {" "}
            (actualizado {new Date(product.cardmarketPriceUpdatedAt).toLocaleDateString("es-ES")})
          </span>
        )}
      </span>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={loading}
        className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
      >
        {loading ? "Consultando..." : "Actualizar precio Cardmarket"}
      </button>
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}
