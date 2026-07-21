import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/ProductForm";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { MovementHistory } from "@/components/MovementHistory";
import { MovementForm } from "@/components/MovementForm";
import { CardmarketPriceRefresh } from "@/components/CardmarketPriceRefresh";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { movements: { orderBy: { occurredAt: "desc" } } },
  });

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">{product.name}</h1>
        <DeleteProductButton productId={product.id} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Datos del producto</h2>
        <ProductForm product={product} />
        <CardmarketPriceRefresh product={product} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Registrar movimiento</h2>
        <MovementForm productId={product.id} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Historial</h2>
        <MovementHistory movements={product.movements} />
      </section>
    </div>
  );
}
