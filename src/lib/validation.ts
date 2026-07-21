import { z } from "zod";

export const productTypeValues = ["SEALED_BOX", "BOOSTER_PACK", "SINGLE_CARD", "OTHER"] as const;
export const itemStateValues = ["SEALED", "LOOSE"] as const;
export const conditionValues = ["NM", "LP", "MP", "HP", "DMG"] as const;
export const currencyValues = ["EUR", "USD"] as const;
export const movementTypeValues = ["IN", "OUT"] as const;
export const channelValues = ["CARDMARKET", "EBAY", "VINTED", "OTHER"] as const;

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);
const emptyToNull = (val: unknown) => (val === "" ? null : val);

export const productSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  set: z.string().trim().min(1, "El set es obligatorio"),
  cardNumber: z.preprocess(emptyToNull, z.string().trim().nullable().optional()),
  productType: z.enum(productTypeValues),
  itemState: z.enum(itemStateValues),
  condition: z.preprocess(emptyToNull, z.enum(conditionValues).nullable().optional()),
  language: z.string().trim().min(1, "El idioma es obligatorio"),
  rarity: z.preprocess(emptyToNull, z.string().trim().nullable().optional()),
  currency: z.enum(currencyValues),
  purchasePriceCents: z.number().int().min(0),
  salePriceCents: z.preprocess(emptyToNull, z.number().int().min(0).nullable().optional()),
  cardmarketProductId: z.preprocess(emptyToNull, z.number().int().positive().nullable().optional()),
  lowStockThreshold: z.preprocess(emptyToNull, z.number().int().min(0).nullable().optional()),
  notes: z.preprocess(emptyToNull, z.string().trim().nullable().optional()),
});

export type ProductInput = z.infer<typeof productSchema>;

export const movementSchema = z
  .object({
    type: z.enum(movementTypeValues),
    quantity: z.number().int().positive("La cantidad debe ser mayor que 0"),
    channel: z.preprocess(emptyToUndefined, z.enum(channelValues).optional()),
    unitPriceCents: z.preprocess(emptyToNull, z.number().int().min(0).nullable().optional()),
    currency: z.preprocess(emptyToUndefined, z.enum(currencyValues).optional()),
    note: z.preprocess(emptyToNull, z.string().trim().nullable().optional()),
    occurredAt: z.string().optional(),
  })
  .refine((data) => data.type !== "OUT" || data.channel != null, {
    message: "El canal es obligatorio al registrar una venta",
    path: ["channel"],
  });

export type MovementInput = z.infer<typeof movementSchema>;

export const settingsSchema = z.object({
  defaultLowStockThreshold: z.number().int().min(0),
});
