import { cardmarketGet } from "./client";
import { isCardmarketConfigured } from "./isConfigured";

export type CardmarketPriceResult =
  | { configured: false; priceCents: null }
  | { configured: true; priceCents: number | null };

/**
 * Cardmarket's price guide returns euros as floats. We prefer the "trend"
 * price (their smoothed market estimate) and fall back to a plain sell
 * price if trend isn't present. Never throws — callers always get a safe
 * "unavailable" shape instead of a broken page.
 */
export async function getProductPrice(cardmarketProductId: number): Promise<CardmarketPriceResult> {
  if (!isCardmarketConfigured()) {
    return { configured: false, priceCents: null };
  }

  try {
    const data = (await cardmarketGet(`/products/${cardmarketProductId}`)) as {
      product?: { priceGuide?: Record<string, number | undefined> };
    };

    const priceGuide = data?.product?.priceGuide;
    const priceEuros = priceGuide?.TREND ?? priceGuide?.SELL ?? priceGuide?.AVG ?? null;

    if (priceEuros == null || Number.isNaN(priceEuros)) {
      return { configured: true, priceCents: null };
    }

    return { configured: true, priceCents: Math.round(priceEuros * 100) };
  } catch {
    return { configured: true, priceCents: null };
  }
}
