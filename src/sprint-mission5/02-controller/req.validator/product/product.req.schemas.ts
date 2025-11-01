import z from "zod";

export const createProductReqSchema = z.object({
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  tags: z.array(z.string()),
});

export const getProductReqSchema = z.object({
  productId: z.string(),
});

export const getProductListReqSchema = z.object({
  offset: z.number().default(0),
  limit: z.number().default(5),
  sort: z.enum(["recent", "price-lowest", "price-highest"]).default("recent")
});

export const getLikedProductsReqSchema = z.object({
  userId: z.string(),
  productId: z.string(),
});

export const updateProductReqSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const deleteProductReqSchema = z.object({
  userId: z.string(),
  productId: z.string(),
});

export const productLikeReqSchema = z.object({
  userId: z.string(),
  productId: z.string(),
});

export const createProductCommentReqSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  content: z.string()
});

export const getProductCommentReqSchema = z.object({
  productId: z.string(),
  cursor: z.number().default(0),
  limit: z.number().default(5),
  sort: z.enum(["recent", "id-asc", "id-desc"]).default("recent"),
});

export const updateProductCommentReqSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  commentId: z.coerce.number(),
  content: z.string()
});

export const deleteProductCommentReqSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  commentId: z.coerce.number(),
});