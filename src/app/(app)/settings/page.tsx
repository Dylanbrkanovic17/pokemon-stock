import { prisma } from "@/lib/db";
import { isCardmarketConfigured } from "@/lib/cardmarket/isConfigured";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  const cardmarketConfigured = isCardmarketConfigured();

  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <h1 className="text-xl font-semibold text-zinc-900">Ajustes</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Stock bajo</h2>
        <SettingsForm defaultLowStockThreshold={settings.defaultLowStockThreshold} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Cardmarket</h2>
        {cardmarketConfigured ? (
          <p className="inline-flex w-fit items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Conectado
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="inline-flex w-fit items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
              No configurado
            </p>
            <p className="text-sm text-zinc-600">
              Para ver precios de mercado de Cardmarket, genera un App Token y App Secret desde tu cuenta de
              Cardmarket (Account → Extras → API), y añade las cuatro variables{" "}
              <code className="rounded bg-zinc-100 px-1">CARDMARKET_APP_TOKEN</code>,{" "}
              <code className="rounded bg-zinc-100 px-1">CARDMARKET_APP_SECRET</code>,{" "}
              <code className="rounded bg-zinc-100 px-1">CARDMARKET_ACCESS_TOKEN</code> y{" "}
              <code className="rounded bg-zinc-100 px-1">CARDMARKET_ACCESS_TOKEN_SECRET</code> en las variables
              de entorno del servidor. El resto de la app funciona igual sin esto.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
