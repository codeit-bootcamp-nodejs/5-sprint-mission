import { PrismaClient } from "@prisma/client/extension";
import { BaseRepository } from "./base.repository";
import { Prisma } from "@prisma/client";
import { NewArticleComment, PersistedArticleComment } from "../../02-domain/entity/article.comment.entity";
import { ArticleCommentMapper } from "../mapper/article.comment.mapper";
import { IArticleCommentRepository } from "../../02-domain/port/repositories/I.article.comment.repository";




export type PersistArticleComment = Prisma.ArticleCommentGetPayload<{}>

export class ArticleCommentRepository extends BaseRepository implements IArticleCommentRepository {

    constructor(prisma: PrismaClient) {
        super(prisma);
    }



    async save(entity: NewArticleComment) {
        const { userId, articleId, content } = entity;
        const articleComment = await this.prisma.articleComment.create({
            data: {
                userId,
                articleId,
                content
            }
        });

        return ArticleCommentMapper.toPersist(articleComment);
    }


    async findArticleComments(articleId: string) {
        const articleComment = await this.prisma.articleComment.findMany({
            where: { articleId }
        });

        const articleEntites = articleComment.map((record: PersistArticleComment) => {
            return ArticleCommentMapper.toPersist(record);
        })

        return articleEntites;
    }

    async findArticleComment(commentId: string) {
        const articleComment = await this.prisma.articleComment.findUnique({
            where: { id: commentId }
        });

        return ArticleCommentMapper.toPersist(articleComment);
    }

    async deleteArticleComment(commentId: string) {
        await this.prisma.articleComment.delete({
            where: { id: commentId }
        });
    }

    async update(entity: PersistedArticleComment) {
        const { userId, articleId, content, id } = entity;
        const articleComment = await this.prisma.articleComment.update({
            where: { id },
            data: {
                userId,
                articleId,
                content
            }
        });

        return ArticleCommentMapper.toPersist(articleComment);
    }
}


