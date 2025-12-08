import { IArticleCommentService } from "../../01-inbound/port/services/i.article.comment.service";
import { ArticleCommentDto } from "../../01-inbound/request/req.validator";
import { ArticleCommentResDto } from "../../01-inbound/response/article.comment.response";
import { Authenticator } from "../../external/authenticator";
import { IBaseRepository } from "../port/I.base.repository";





export class ArticleCommentService implements IArticleCommentService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }




    async createArticleComment(dto: ArticleCommentDto) {
        const { articleId, userId, content } = dto;
        const articleCommentResDto = await this.#repos.articleComment.save(userId, articleId, content);
        await this.#repos.notification.createArticleCommentNotification(userId);
        return new ArticleCommentResDto(articleCommentResDto);   

    }

    async getArticleComments(articleId: string) {
        const articleCommentResDtos = await this.#repos.articleComment.findArticleComments(articleId);
        return articleCommentResDtos.map(dto => new ArticleCommentResDto(dto));
    }

    async updateArticleComment(dto: ArticleCommentDto) {
        const { articleId, commentId, content, userId } = dto;
        if (!commentId) {
            throw new Error('Comment ID is required for updating a comment.');
        }


        const articleComment = await this.#repos.articleComment.findArticleComment(commentId);
        if (!articleComment) {
            throw new Error('Article comments not found.');
        }
        if (articleComment.userId !== userId) {
            throw new Error('Unauthorized to update this comment.');
        }

        articleComment.update(content);
        const articleCommentResDto = await this.#repos.articleComment.update(articleComment);
        return new ArticleCommentResDto(articleCommentResDto);
    }

    async deleteArticleComments(articleId: string, commentId: string, userId: string) {
        const articleComment = await this.#repos.articleComment.findArticleComment(commentId);
        if (!articleComment) {
            throw new Error('Article comments not found.');
        }
        
        if (articleComment.userId !== userId) {
            throw new Error('Unauthorized to delete this comment.');
        }

        await this.#repos.articleComment.deleteArticleComment(commentId);
    }

}