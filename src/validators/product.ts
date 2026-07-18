import { z } from 'zod';

export const createVariantSchema = z.object({
  sku: z.string().min(3).max(50),
  name: z.string().optional(),
  base_price: z.number().positive(),
  sale_price: z.number().positive().optional(),
  weight_grams: z.number().int().nonnegative().optional(),
  initial_stock: z.number().int().nonnegative().default(0),
});

export const createProductSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), // URL friendly
  brand_id: z.string().uuid().optional(),
  category_id: z.string().uuid(),
  short_description: z.string().max(500).optional(),
  long_description: z.string().optional(),
  is_published: z.boolean().default(false),
  variants: z.array(createVariantSchema).min(1, "A product must have at least one variant"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;