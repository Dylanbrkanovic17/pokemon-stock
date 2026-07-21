"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { movementTypeValues, channelValues, currencyValues } from "@/lib/validation";
import { movementTypeLabels, channelLabels } from "@/lib/labels";
import { parseToCents } from "@/lib/money";

export function MovementForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [type, setType] = useState<(typeof movementTypeValues)[number]>("IN");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const unitPriceRaw = String(form.get("unitPrice") ?? "");

    const payload = {
      productId,
      type,
      quantity: Number(form.get("quantity")),
      channel: type === "OUT" ? form.get("channel") : undefined,
      unitPriceCents: unitPriceRaw ? parseToCents(unitPriceRaw) : null,
      currency: unitPriceRaw ? form.get("currency") : undefined,
      note: form.get("note"),
    };

    const res = await fetch("/api/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(typeof data?.error === "string" ? data.error : "No se pudo registrar el movimiento");
      return;
    }

    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">Tipo</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="input"
          >
            {movementTypeValues.map((v) => (
              <option key={v} value={v}>
                {movementTypeLabels[v]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">Cantidad</span>
          <input name="quantity" type="number" min={1} required defaultValue={1} className="input w-24" />
        </label>

        {type === "OUT" && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">Canal</span>
            <select name="channel" required className="input">
              {channelValues.map((v) => (
                <option key={v} value={v}>
                  {channelLabels[v]}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">
            {type === "IN" ? "Precio de compra" : "Precio de venta"}
          </span>
          <input name="unitPrice" inputMode="decimal" placeholder="0.00" className="input w-28" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">Moneda</span>
          <select name="currency" defaultValue="EUR" className="input">
            {currencyValues.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 min-w-[160px] flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">Nota</span>
          <input name="note" className="input" />
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Guardando..." : "Registrar movimiento"}
        </button>
      </div>
    </form>
  );
}
