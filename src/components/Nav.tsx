import Link from "next/link";
import { prisma } from "@/lib/db";

async function getLowStockCount() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const defaultThreshold = settings?.defaultLowStockThreshold ?? 3;

  const products = await prisma.product.findMany({
    select: { quantity: true, lowStockThreshold: true },
  });
  return products.filter((p) => p.quantity < (p.lowStockThreshold ?? defaultThreshold)).length;
}

export async function Nav() {
  const lowStockCount = await getLowStockCount();

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="font-semibold text-zinc-900">
          Pokémon Stock
        </Link>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          Inventario
        </Link>
        <Link href="/products/new" className="text-sm text-zinc-600 hover:text-zinc-900">
          Añadir producto
        </Link>
        <Link href="/low-stock" className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900">
          Stock bajo
          {lowStockCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-medium text-white">
              {lowStockCount}
            </span>
          )}
        </Link>
        <Link href="/settings" className="text-sm text-zinc-600 hover:text-zinc-900">
          Ajustes
        </Link>
        <form action="/api/auth/logout" method="POST" className="ml-auto">
          <button type="submit" className="text-sm text-zinc-500 hover:text-zinc-900">
            Cerrar sesión
          </button>
        </form>
      </div>
    </nav>
  );
}
