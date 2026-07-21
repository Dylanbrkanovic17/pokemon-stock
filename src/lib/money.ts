import type { Currency } from "@/generated/prisma/client";

const LOCALE_BY_CURRENCY: Record<Currency, string> = {
  EUR: "es-ES",
  USD: "en-US",
};

export function formatCents(cents: number, currency: Currency): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function parseToCents(amount: string): number | null {
  const normalized = amount.trim().replace(",", ".");
  if (normalized === "" || Number.isNaN(Number(normalized))) return null;
  return Math.round(Number(normalized) * 100);
}

export function centsToDecimalString(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}
