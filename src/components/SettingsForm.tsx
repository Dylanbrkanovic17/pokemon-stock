"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsForm({ defaultLowStockThreshold }: { defaultLowStockThreshold: number }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultLowStockThreshold: Number(form.get("defaultLowStockThreshold")),
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700">Umbral por defecto</span>
        <input
          name="defaultLowStockThreshold"
          type="number"
          min={0}
          required
          defaultValue={defaultLowStockThreshold}
          className="input w-32"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Guardando..." : "Guardar"}
      </button>
      {saved && <span className="text-sm text-emerald-600">Guardado</span>}
    </form>
  );
}
