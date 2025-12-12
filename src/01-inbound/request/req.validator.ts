import { z } from "zod";

export const querySchema = z.object({
    offset: z.coerce.number({ message: "offset이 유효하지 않습니다" }).default(0).optional(),
    limit: z.coerce.number().default(10).optional(),
    search: z.string().optional().default("").optional(),
    sort: z.string().optional().default("desc").optional()
})

export type QueryType = z.infer<typeof querySchema>;


// Article
export const articleBodySchema = querySchema.extend({
    title: z.string(),
    content: z.string(),
})

export const articleParamSchema = z.object({
    id: z.string().optional()
})

export type ArticleReqDto = z.infer<typeof articleBodySchema> &
    z.infer<typeof articleParamSchema> & {
        userId: string
    };



// Product
export const productBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.coerce.number(),
    tags: z.array(z.string()),
    imageUrl: z.string().optional(),
    isLiked: z.boolean().default(false)
})

export const productParamSchema = z.object({
    id: z.string().optional()
})

export type ProductReqDto = z.infer<typeof productBodySchema> &
    z.infer<typeof productParamSchema> &
{
    userId: string
};



// User
export const userBodySchema = z.object({
    email: z.string(),
    nickname: z.string(),
    password: z.string(),
})


export type UserSignUpDto = z.infer<typeof userBodySchema> 


export type UserSignInDto = z.infer<typeof userBodySchema> &
{
    nickname?: string,
    userId: string
};



// Product Comment
export const productCommentBodySchema = z.object({
    content: z.string()
})

export const productCommentParamSchema = z.object({
    productId: z.string(),
    commentId: z.string().optional()
})

export type ProductCommentRequest = z.infer<typeof productCommentBodySchema> &
    z.infer<typeof productCommentParamSchema> & {
        userId: string
    };



// Article Comment
export const articleCommentBodySchema = z.object({
    content: z.string()
})

export const articleCommentParamSchema = z.object({
    articleId: z.string(),
    commentId: z.string().optional()
})

export type ArticleCommentDto = z.infer<typeof articleCommentBodySchema> &
    z.infer<typeof articleCommentParamSchema> & {
        userId: string
    };









