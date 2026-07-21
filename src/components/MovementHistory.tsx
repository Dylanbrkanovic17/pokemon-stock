import type { StockMovement } from "@/generated/prisma/client";
import { formatCents } from "@/lib/money";
import { movementTypeLabels, channelLabels } from "@/lib/labels";

export function MovementHistory({ movements }: { movements: StockMovement[] }) {
  if (movements.length === 0) {
    return <p className="text-sm text-zinc-500">Todavía no hay movimientos registrados.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2 text-right">Cantidad</th>
            <th className="px-4 py-2">Canal</th>
            <th className="px-4 py-2 text-right">Precio unidad</th>
            <th className="px-4 py-2">Nota</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {movements.map((m) => (
            <tr key={m.id}>
              <td className="px-4 py-2 text-zinc-600">
                {new Date(m.occurredAt).toLocaleDateString("es-ES")}
              </td>
              <td className="px-4 py-2">
                <span className={m.type === "IN" ? "text-emerald-600" : "text-zinc-900"}>
                  {movementTypeLabels[m.type]}
                </span>
              </td>
              <td className="px-4 py-2 text-right">{m.quantity}</td>
              <td className="px-4 py-2 text-zinc-600">{m.channel ? channelLabels[m.channel] : "—"}</td>
              <td className="px-4 py-2 text-right text-zinc-600">
                {m.unitPriceCents != null && m.currency ? formatCents(m.unitPriceCents, m.currency) : "—"}
              </td>
              <td className="px-4 py-2 text-zinc-600">{m.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
