import z from "zod";

// Product Comment
export const productCommentBodySchema = z.object({
  content: z.string(),
});

export const productCommentParamSchema = z.object({
  productId: z.string(),
  commentId: z.string().optional(),
});

export type ProductCommentDto = z.infer<typeof productCommentBodySchema> &
  z.infer<typeof productCommentParamSchema> & {
    userId: string;
  };
