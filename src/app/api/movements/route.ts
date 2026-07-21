import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { movementSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, ...rest } = body ?? {};

  if (typeof productId !== "string" || productId.length === 0) {
    return NextResponse.json({ error: "productId es obligatorio" }, { status: 400 });
  }

  const parsed = movementSchema.safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { type, quantity, channel, unitPriceCents, currency, note, occurredAt } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("NOT_FOUND");

      if (type === "OUT" && product.quantity < quantity) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type,
          quantity,
          channel: type === "OUT" ? channel : undefined,
          unitPriceCents: unitPriceCents ?? undefined,
          currency: currency ?? undefined,
          note: note ?? undefined,
          occurredAt: occurredAt ? new Date(occurredAt) : undefined,
        },
      });

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { quantity: { [type === "IN" ? "increment" : "decrement"]: quantity } },
      });

      return { movement, updatedProduct };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    if (err instanceof Error && err.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "No hay stock suficiente para esta venta" }, { status: 400 });
    }
    throw err;
  }
}
