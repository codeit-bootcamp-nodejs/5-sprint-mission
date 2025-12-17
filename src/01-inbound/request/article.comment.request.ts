import z from "zod";

// Article Comment
export const articleCommentBodySchema = z.object({
  content: z.string(),
});

export const articleCommentParamSchema = z.object({
  articleId: z.string(),
  commentId: z.string().optional(),
});

export type ArticleCommentDto = z.infer<typeof articleCommentBodySchema> &
  z.infer<typeof articleCommentParamSchema> & {
    userId: string;
  };
