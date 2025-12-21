import { Prisma, PrismaClient } from "@prisma/client";
import { IArticleQueryRepository } from "../../../02-application/port/repositories/query/I.article.query.repository";
import { string } from "zod";
import { ar, id } from "zod/v4/locales";
import { QueryType } from "../../../01-inbound/request/query.request";
import { ArticleView } from "../../../02-application/query/view/article.view";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";

export const createArticleQueryRepository = (
    prisma: PrismaClient,
): IArticleQueryRepository => {
    const findAll = async (query: QueryType): Promise<ArticleView[]> => {
        const { offset, limit, search, sort } = query;

        const condition: Prisma.ArticleWhereInput = search
            ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { content: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};

        const articles = await prisma.article.findMany({
            where: condition,
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: sort ? "desc" : "asc",
            },
            include: {
                User: true,
                ArticleComment: {
                    include: {
                        user: true
                    }
                }
            }
        });



        return articles.map((article) => {
            return {
                id: article.id,
                title: article.title,
                content: article.content,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                author: {
                    nickname: article.User.nickname
                },
                comments: article.ArticleComment.map((comment) => {
                    return {
                        nickname: comment.user.nickname,
                        content: comment.content
                    }
                })
            }
        });

    };


    const findById = async (id: string): Promise<ArticleView> => {
        const article = await prisma.article.findUnique({
            where: { id },
            include: {
                User: true,
                ArticleComment: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!article) {
            throw BusinessException({
                type: BusinessExceptionType.DATA_NOT_FOUND
            });
        }

        return {
            id: article.id,
            title: article.title,
            content: article.content,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            author: {
                nickname: article.User.nickname
            },
            comments: article.ArticleComment.map((comment) => {
                return {
                    nickname: comment.user.nickname,
                    content: comment.content
                };
            })
        };
    };

    return {
        findAll,
        findById,
    };
};
