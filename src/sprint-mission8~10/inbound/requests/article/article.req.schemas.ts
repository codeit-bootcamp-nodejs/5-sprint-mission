import z from "zod";

export type CreateArticleDto= z.infer<typeof createArticleReqSchema>;
export type GetArticleDto= z.infer<typeof getArticleReqSchema>;
export type GetArticleListDto= z.infer<typeof getArticleListReqSchema>;
export type GetLikedArticlesDto= z.infer<typeof getLikedArticlesReqSchema>;
export type UpdateArticleDto= z.infer<typeof updateArticleReqSchema>;
export type DeleteArticleDto= z.infer<typeof deleteArticleReqSchema>;
export type ArticleLikeDto= z.infer<typeof articleLikeReqSchema>;
export type CreateArticleCommentDto= z.infer<typeof createArticleCommentReqSchema>;
export type GetArticleCommentDto= z.infer<typeof getArticleCommentReqSchema>;
export type UpdateArticleCommentDto= z.infer<typeof updateArticleCommentReqSchema>;
export type DeleteArticleCommentDto= z.infer<typeof deleteArticleCommentReqSchema>;

export const createArticleReqSchema = z.object({
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  image: z.string().optional(),
});

export const getArticleReqSchema = z.object({
  articleId: z.string(),
});

export const getArticleListReqSchema = z.object({
  offset: z.number().default(0),
  limit: z.number().default(5),
  sort: z.enum(["recent", "title-asc", "title-desc"]).default("recent")
});

export const getLikedArticlesReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
});

export const updateArticleReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
});

export const deleteArticleReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
});

export const articleLikeReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
});

export const createArticleCommentReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
  content: z.string()
});

export const getArticleCommentReqSchema = z.object({
  articleId: z.string(),
  cursor: z.number().default(0),
  limit: z.number().default(5),
  sort: z.enum(["recent", "id-asc", "id-desc"]).default("recent"),
});

export const updateArticleCommentReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
  commentId: z.coerce.number(),
  content: z.string()
});

export const deleteArticleCommentReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
  commentId: z.coerce.number(),
});