"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setDeleting(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-red-600 hover:underline"
      >
        Eliminar producto
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-zinc-600">¿Seguro?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-md bg-red-600 px-3 py-1 font-medium text-white disabled:opacity-50"
      >
        {deleting ? "Eliminando..." : "Sí, eliminar"}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="text-zinc-500 hover:underline">
        Cancelar
      </button>
    </div>
  );
}
