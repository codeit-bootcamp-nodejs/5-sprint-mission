import z from "zod";
import { querySchema } from "./query.request";

// Article
export const articleBodySchema = querySchema.extend({
  title: z.string(),
  content: z.string(),
});

export const articleParamSchema = z.object({
  id: z.string().optional(),
});

export type ArticleReqDto = z.infer<typeof articleBodySchema> &
  z.infer<typeof articleParamSchema> & {
    userId: string;
  };
