import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";
import { NewArticleComment, PersistedArticleComment } from "../../02-domain/entity/article.comment.entity";
import { ArticleCommentMapper } from "../mapper/article.comment.mapper";




export type PersistArticleComment = Prisma.ArticleCommentGetPayload<{}>

export const ArticleCommentRepository = (prisma: PrismaClient) => {



    const save = async (entity: NewArticleComment) => {
        const { userId, articleId, content } = entity;
        const articleComment = await prisma.articleComment.create({
            data: {
                userId,
                articleId,
                content
            }
        });

        return ArticleCommentMapper.toPersist(articleComment);
    }


    const findArticleComments = async (articleId: string) => {
        const articleComment = await prisma.articleComment.findMany({
            where: { articleId }
        });

        const articleEntites = articleComment.map((record: PersistArticleComment) => {
            return ArticleCommentMapper.toPersist(record);
        })

        return articleEntites;
    }

    const findArticleComment = async (commentId: string) => {
        const articleComment = await prisma.articleComment.findUnique({
            where: { id: commentId }
        });

        return ArticleCommentMapper.toPersist(articleComment);
    }

    const deleteArticleComment = async (commentId: string) => {
        await prisma.articleComment.delete({
            where: { id: commentId }
        });
    }

    const update = async (entity: PersistedArticleComment) => {
        const { userId, articleId, content, id } = entity;
        const articleComment = await prisma.articleComment.update({
            where: { id },
            data: {
                userId,
                articleId,
                content
            }
        });

        return ArticleCommentMapper.toPersist(articleComment);
    }

    return { 
        save,
        findArticleComments,
        findArticleComment,
        deleteArticleComment,
        update
    }
}


