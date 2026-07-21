import { prisma } from "@/lib/db";
import { ProductTable } from "@/components/ProductTable";
import { isLowStock } from "@/components/LowStockBadge";

export default async function LowStockPage() {
  const [products, settings] = await Promise.all([
    prisma.product.findMany({ orderBy: { quantity: "asc" } }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  const defaultThreshold = settings?.defaultLowStockThreshold ?? 3;
  const lowStockProducts = products.filter((p) =>
    isLowStock(p.quantity, p.lowStockThreshold, defaultThreshold)
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-zinc-900">Stock bajo</h1>
      <p className="text-sm text-zinc-600">
        Productos por debajo de su umbral (umbral por defecto: {defaultThreshold} unidades).
      </p>
      {lowStockProducts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
          Todo el stock está por encima del umbral.
        </p>
      ) : (
        <ProductTable products={lowStockProducts} defaultThreshold={defaultThreshold} />
      )}
    </div>
  );
}
