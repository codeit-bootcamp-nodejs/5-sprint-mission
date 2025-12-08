import { IArticleCommentService } from "../../01-inbound/port/services/i.article.comment.service";
import { ArticleCommentRequest } from "../../01-inbound/request/req.validator";
import { Authenticator } from "../../external/authenticator";
import { IBaseRepository } from "../port/I.base.repository";





export class ArticleCommentService implements IArticleCommentService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }




    async createArticleComment(dto: ArticleCommentRequest) {
        const { articleId, userId, content } = dto;
        const articleCommentResDto = await this.#repos.articleComment.save(userId, articleId, content);
        await this.#repos.notification.createArticleCommentNotification(userId);
        return articleCommentResDto;

    }

    async getArticleComments(articleId: string) {
        const articleCommentResDtos = await this.#repos.articleComment.findArticleComments(articleId);
        return articleCommentResDtos;
    }

    async deleteArticleComments(commentId: string) {
        await this.#repos.articleComment.deleteArticleComment(commentId);
    }

    async updateArticleComment(dto: ArticleCommentRequest) {
        const { articleId, commentId, content, userId } = dto;
        if (!commentId) {
            throw new Error('Comment ID is required for updating a comment.');
        }


        const articleCommentResDto = await this.#repos.articleComment.update(userId, articleId, commentId, content);

        return articleCommentResDto;
    }

}