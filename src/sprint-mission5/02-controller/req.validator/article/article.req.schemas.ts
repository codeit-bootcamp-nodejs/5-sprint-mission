import z from "zod";

export const createArticleReqSchema = z.object({
  userId: z.string(),
  title: z.string(),
  content: z.string(),
});

export const getArticleReqSchema = z.object({
  articleId: z.string(),
});

export const getArticleListReqSchema = z.object({
  offset: z.number(),
  limit: z.number(),
  sort: z.enum(["recent", "title-asc", "title-desc"]).default("recent")
});

export const getLikedArticlesReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
});

export const updateArticleReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
  title: z.string(),
  content: z.string(),
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
  cursor: z.number(),
  limit: z.number(),
  sort: z.enum(["recent", "id-asc", "id-desc"]).default("recent"),
});

export const updateArticleCommentReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
  commentId: z.number(),
  content: z.string()
});

export const deleteArticleCommentReqSchema = z.object({
  userId: z.string(),
  articleId: z.string(),
  commentId: z.number(),
});