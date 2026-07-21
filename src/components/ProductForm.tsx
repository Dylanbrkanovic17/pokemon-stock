"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/generated/prisma/client";
import {
  productTypeValues,
  itemStateValues,
  conditionValues,
  currencyValues,
} from "@/lib/validation";
import { productTypeLabels, itemStateLabels, conditionLabels } from "@/lib/labels";
import { centsToDecimalString, parseToCents } from "@/lib/money";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [itemState, setItemState] = useState(product?.itemState ?? "SEALED");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const purchasePriceCents = parseToCents(String(form.get("purchasePrice") ?? ""));
    const salePriceRaw = String(form.get("salePrice") ?? "");
    const salePriceCents = salePriceRaw ? parseToCents(salePriceRaw) : null;

    if (purchasePriceCents == null) {
      setError("El precio de compra no es válido");
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.get("name"),
      set: form.get("set"),
      cardNumber: form.get("cardNumber"),
      productType: form.get("productType"),
      itemState: form.get("itemState"),
      condition: itemState === "LOOSE" ? form.get("condition") : null,
      language: form.get("language"),
      rarity: form.get("rarity"),
      currency: form.get("currency"),
      purchasePriceCents,
      salePriceCents,
      cardmarketProductId: form.get("cardmarketProductId")
        ? Number(form.get("cardmarketProductId"))
        : null,
      lowStockThreshold: form.get("lowStockThreshold")
        ? Number(form.get("lowStockThreshold"))
        : null,
      notes: form.get("notes"),
    };

    const res = await fetch(isEdit ? `/api/products/${product.id}` : "/api/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("No se pudo guardar el producto. Revisa los campos.");
      return;
    }

    const saved = await res.json();
    router.push(`/products/${saved.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" required>
          <input name="name" required defaultValue={product?.name} className="input" />
        </Field>
        <Field label="Set" required>
          <input name="set" required defaultValue={product?.set} className="input" />
        </Field>
        <Field label="Número de carta">
          <input name="cardNumber" defaultValue={product?.cardNumber ?? ""} className="input" />
        </Field>
        <Field label="Idioma" required>
          <input name="language" required defaultValue={product?.language ?? "ES"} className="input" />
        </Field>
        <Field label="Rareza">
          <input name="rarity" defaultValue={product?.rarity ?? ""} className="input" />
        </Field>
        <Field label="Tipo de producto" required>
          <select name="productType" required defaultValue={product?.productType ?? "SEALED_BOX"} className="input">
            {productTypeValues.map((v) => (
              <option key={v} value={v}>
                {productTypeLabels[v]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado" required>
          <select
            name="itemState"
            required
            value={itemState}
            onChange={(e) => setItemState(e.target.value as typeof itemState)}
            className="input"
          >
            {itemStateValues.map((v) => (
              <option key={v} value={v}>
                {itemStateLabels[v]}
              </option>
            ))}
          </select>
        </Field>
        {itemState === "LOOSE" && (
          <Field label="Condición">
            <select name="condition" defaultValue={product?.condition ?? "NM"} className="input">
              {conditionValues.map((v) => (
                <option key={v} value={v}>
                  {conditionLabels[v]}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Moneda" required>
          <select name="currency" required defaultValue={product?.currency ?? "EUR"} className="input">
            {currencyValues.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Precio de compra" required>
          <input
            name="purchasePrice"
            required
            inputMode="decimal"
            placeholder="0.00"
            defaultValue={centsToDecimalString(product?.purchasePriceCents)}
            className="input"
          />
        </Field>
        <Field label="Precio de venta (objetivo)">
          <input
            name="salePrice"
            inputMode="decimal"
            placeholder="0.00"
            defaultValue={centsToDecimalString(product?.salePriceCents)}
            className="input"
          />
        </Field>
        <Field label="ID producto Cardmarket">
          <input
            name="cardmarketProductId"
            inputMode="numeric"
            defaultValue={product?.cardmarketProductId ?? ""}
            className="input"
          />
        </Field>
        <Field label="Umbral de stock bajo (opcional)">
          <input
            name="lowStockThreshold"
            inputMode="numeric"
            placeholder="Usa el valor por defecto de Ajustes"
            defaultValue={product?.lowStockThreshold ?? ""}
            className="input"
          />
        </Field>
      </div>

      <Field label="Notas">
        <textarea name="notes" defaultValue={product?.notes ?? ""} rows={3} className="input" />
      </Field>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
