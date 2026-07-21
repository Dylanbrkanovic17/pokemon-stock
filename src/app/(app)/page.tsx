import { prisma } from "@/lib/db";
import { ProductTable } from "@/components/ProductTable";
import { productTypeLabels } from "@/lib/labels";
import { productTypeValues } from "@/lib/validation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; productType?: string }>;
}) {
  const { q, productType } = await searchParams;

  const [products, settings] = await Promise.all([
    prisma.product.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { set: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          productType && productTypeValues.includes(productType as (typeof productTypeValues)[number])
            ? { productType: productType as (typeof productTypeValues)[number] }
            : {},
        ],
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  const defaultThreshold = settings?.defaultLowStockThreshold ?? 3;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-zinc-900">Inventario</h1>

      <form className="flex flex-wrap gap-2" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nombre o set..."
          className="min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <select
          name="productType"
          defaultValue={productType ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los tipos</option>
          {productTypeValues.map((type) => (
            <option key={type} value={type}>
              {productTypeLabels[type]}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Filtrar
        </button>
      </form>

      <ProductTable products={products} defaultThreshold={defaultThreshold} />
    </div>
  );
}
