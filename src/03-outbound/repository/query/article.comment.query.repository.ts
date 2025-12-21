import { PrismaClient } from "@prisma/client";
import { IArticleCommentQueryRepository } from "../../../02-application/port/repositories/query/I.article.comment.query.repository";
import { ArticleCommentView } from "../../../02-application/query/view/article.comment.view";

export const createArticleCommentQueryRepository = (
    prisma: PrismaClient
): IArticleCommentQueryRepository => {
    const findAll = async (id: string): Promise<ArticleCommentView[]> => {
        const articleComments = await prisma.articleComment.findMany({
            where: {
                articleId: id
            },
            include: {
                article: true,
                user: true
            }
        })

        return articleComments.map((articleComment) => {
            return {
                id: articleComment.id,
                articleTitle: articleComment.article.title,
                content: articleComment.content,
                createdAt: articleComment.createdAt,
                updatedAt: articleComment.updatedAt,
                author: {
                    nickname: articleComment.user.nickname
                }
            }
        })

    }

    return {
        findAll
    }
}