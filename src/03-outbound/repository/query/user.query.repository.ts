import { PrismaClient } from "@prisma/client";
import { IProductCommentQueryRepository } from "../../../02-application/port/repositories/query/I.product.comment.query.repository";
import { ProductCommentView } from "../../../02-application/query/view/product.comment.view";
import { IUserQueryRepository } from "../../../02-application/port/repositories/query/I.user.query.repository";

import { string, number } from "zod";
import { UserArticleView } from "../../../02-application/query/view/user/user.article.view";
import { UserCommentView } from "../../../02-application/query/view/user/user.comment.view";
import { UserProductView } from "../../../02-application/query/view/user/user.product.view";
import { UserView } from "../../../02-application/query/view/user/user.view";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";

export const createUserQueryRepository = (
    prisma: PrismaClient
): IUserQueryRepository => {
    const findById = async (id: string): Promise<UserView> => {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                product: true,
                article: true,
                ProductComment: true,
                articleComment: true
            }
        });

        if (!user) {
            throw BusinessException({
                type: BusinessExceptionType.DATA_NOT_FOUND
            })
        }

        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            image: user.image ?? undefined,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            myProducts: user.product.map((product) => {
                return {
                    name: product.name,
                    price: product.price,
                    tags: product.tags,
                    likeCount: product.likeCount
                }
            }),

            myArticles: user.article.map((article) => {
                return {
                    title: article.title,
                    createdAt: article.createdAt
                }
            }),

            myComments: {
                article: user.articleComment.map((articleComment) => {
                    return {
                        content: articleComment.content
                    }
                }),

                product: user.ProductComment.map((productComment) => {
                    return {
                        content: productComment.content
                    }
                })
            }

        }
    }


    const findProducts = async (id: string): Promise<UserProductView> => {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                product: true
            }
        });

        if (!user) {
            throw BusinessException({
                type: BusinessExceptionType.DATA_NOT_FOUND
            })
        }

        return {
            nickname: user.nickname,
            products: user.product.map((product) => {
                return {
                    name: product.name,
                    createdAt: product.createdAt,
                    likeCount: product.likeCount
                }
            })
        }
    }


    const findArticles = async (id: string): Promise<UserArticleView> => {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                article: true
            }
        })


        if (!user) {
            throw BusinessException({
                type: BusinessExceptionType.DATA_NOT_FOUND
            })
        }

        return {
            nickname: user.nickname,
            articles: user.article.map((article) => {
                return {
                    title: article.title,
                    createdAt: article.createdAt
                }
            })
        }
    };

    const findComments = async (id: string): Promise<UserCommentView> => {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                articleComment: true,
                ProductComment: true
            }
        });

        if (!user) {
            throw BusinessException({
                type: BusinessExceptionType.DATA_NOT_FOUND
            })
        }

        return {
            nickname: user.nickname,
            productComments: user.ProductComment.map((comment) => {
                return {
                    content: comment.content,
                    createdAt: comment.createdAt
                }
            }),
            articleComments: user.articleComment.map((comment) => {
                return {
                    content: comment.content,
                    createdAt: comment.createdAt
                }
            })
        }
    };


    return {
        findById,
        findProducts,
        findArticles,
        findComments
    }

}


