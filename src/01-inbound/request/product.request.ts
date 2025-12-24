import z from "zod";

// Product
export const productBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
});

export const productParamSchema = z.object({
  id: z.string().optional(),
});

export type ProductDto = z.infer<typeof productBodySchema> &
  z.infer<typeof productParamSchema> & {
    userId: string;
  };
