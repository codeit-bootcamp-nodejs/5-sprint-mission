import { z } from "zod";

export const querySchema = z.object({
    offset: z.coerce.number({ message: "offset이 유효하지 않습니다" }).default(0).optional(),
    limit: z.coerce.number().default(10).optional(),
    search: z.string().optional().default("").optional(),
    sort: z.string().optional().default("desc").optional()
})



export const articleReqSchema = querySchema.extend({
    body: z.object({
        title: z.string(),
        content: z.string(),
    }),

    user: z.object({
        userId: z.string()
    }),

    params: z.object({
        id: z.string().optional()
    }).optional()
})



export const productReqSchema = querySchema.extend({
    body: z.object({
        name: z.string(),
        description: z.string(),
        price: z.coerce.number(),
        tags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        isLiked: z.boolean().default(false)
    }),

    user: z.object({
        userId: z.string()
    }),

    params: z.object({
        id: z.string().optional()
    }).optional()
})

export const userReqSchema = z.object({
    email: z.string(),
    nickname: z.string(),
    password: z.string(),

})


export const productCommentSchema = z.object({
    body: z.object({
        content: z.string()
    }),
    params: z.object({
        productId: z.string(),
        commentId: z.string().optional()
    }),

    user: z.object({
        userId: z.string()
    })

})




export const articleCommentSchema = z.object({
    body: z.object({
        content: z.string()
    }),
    params: z.object({
        articleId: z.string(),
        commentId: z.string().optional()
    }),

    user: z.object({
        userId: z.string()
    })

})

export type QueryType = z.infer<typeof querySchema>;
export type ArticleRequest = z.infer<typeof articleReqSchema>;
export type ProductRequest = z.infer<typeof productReqSchema>;

export type UserSignUpDto = z.infer<typeof userReqSchema>;
export type UserSignInDto = Omit<z.infer<typeof userReqSchema>, 'nickname'>;


export type ProductCommentRequest = z.infer<typeof productCommentSchema>;
export type ArticleCommentRequest = z.infer<typeof articleCommentSchema>;

