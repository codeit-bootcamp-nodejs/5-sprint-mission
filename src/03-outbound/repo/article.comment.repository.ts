import { PrismaClient } from "@prisma/client/extension";
import { BaseRepository } from "./base.repository";
import { ArticleCommentResDto } from "../../01-inbound/response/article.comment.res.dto";



export interface IArticleCommentRepository {
    save(userId: string, articleId: string, content: string): Promise<ArticleCommentResDto>
    findArticleComments(articleId: string): Promise<ArticleCommentResDto[]>;
    deleteArticleComment(commentId: string): void;
    update(userId: string, articleId: string, commentId: string, content: string): Promise<ArticleCommentResDto>
}

export class ArticleCommentRepository extends BaseRepository implements IArticleCommentRepository {

    constructor(prisma: PrismaClient) {
        super(prisma);
    }


    // deleteArticleComment(commentId: string): void {
    //     throw new Error("Method not implemented.");
    // }

    async save(userId: string, articleId: string, content: string) {
        const articleComment = await this.prisma.articleComment.create({
            data: {
                userId,
                articleId,
                content
            }
        });

        return new ArticleCommentResDto(articleComment);
    }

    async findArticleComments(articleId: string) {
        const articleComment = await this.prisma.articleComment.findMany({
            where: { articleId }
        });

        const articleResDtos = articleComment.map((record: any) => {
            return new ArticleCommentResDto(record);
        })

        return articleResDtos;
    }

    async deleteArticleComment(commentId: string) {
        await this.prisma.articleComment.delete({
            where: { id: commentId }
        });
        console.log(`Deleted ${commentId}`);

    }

    async update(userId: string, articleId: string, commentId: string, content: string) {
        const articleComment = await this.prisma.articleComment.update({
            where: {id :commentId},
            data: {
                userId,
                articleId,
                content
            }
        });

        return new ArticleCommentResDto(articleComment);
    }
}


