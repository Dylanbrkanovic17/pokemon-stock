import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getProductPrice } from "@/lib/cardmarket/getProductPrice";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if (!product.cardmarketProductId) {
    return NextResponse.json({ error: "Este producto no tiene ID de Cardmarket" }, { status: 400 });
  }

  const result = await getProductPrice(product.cardmarketProductId);

  if (!result.configured) {
    return NextResponse.json({ error: "Cardmarket no está configurado" }, { status: 400 });
  }
  if (result.priceCents == null) {
    return NextResponse.json({ error: "No se pudo obtener el precio de Cardmarket" }, { status: 502 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { cardmarketPriceCents: result.priceCents, cardmarketPriceUpdatedAt: new Date() },
  });

  return NextResponse.json(updated);
}
