import type { Currency, Product } from "@/generated/prisma/client";

type MarginResult =
  | { kind: "none" }
  | { kind: "same-currency"; amountCents: number; currency: Currency; source: "sale" | "cardmarket" }
  | {
      kind: "cross-currency";
      purchaseCents: number;
      purchaseCurrency: Currency;
      referenceCents: number;
      referenceCurrency: Currency;
    };

/**
 * cardmarketPriceCents is always EUR (Cardmarket's price guide). salePriceCents
 * shares the product's own currency. Only subtract when both sides agree on
 * currency — otherwise surface both amounts instead of a misleading number.
 */
export function computeMargin(
  product: Pick<Product, "currency" | "purchasePriceCents" | "salePriceCents" | "cardmarketPriceCents">
): MarginResult {
  if (product.salePriceCents != null) {
    return {
      kind: "same-currency",
      amountCents: product.salePriceCents - product.purchasePriceCents,
      currency: product.currency,
      source: "sale",
    };
  }

  if (product.cardmarketPriceCents != null) {
    if (product.currency === "EUR") {
      return {
        kind: "same-currency",
        amountCents: product.cardmarketPriceCents - product.purchasePriceCents,
        currency: "EUR",
        source: "cardmarket",
      };
    }
    return {
      kind: "cross-currency",
      purchaseCents: product.purchasePriceCents,
      purchaseCurrency: product.currency,
      referenceCents: product.cardmarketPriceCents,
      referenceCurrency: "EUR",
    };
  }

  return { kind: "none" };
}
