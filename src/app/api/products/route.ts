import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { productSchema, productTypeValues } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const productTypeParam = request.nextUrl.searchParams.get("productType");
  const productType = productTypeValues.find((v) => v === productTypeParam);

  const products = await prisma.product.findMany({
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
        productType ? { productType } : {},
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
