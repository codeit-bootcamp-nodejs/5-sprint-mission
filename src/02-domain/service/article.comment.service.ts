import { IArticleCommentService } from "../../01-inbound/port/services/i.article.comment.service";
import { ArticleCommentRequest } from "../../01-inbound/request/req.validator";
import { IBaseRepository } from "../../03-outbound/I.base.repository";
import { Authenticator } from "../../external/authenticator";





export class ArticleCommentService implements IArticleCommentService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }




    async createArticleComment(dto: ArticleCommentRequest) {
        const { articleId, userId, content } = dto;
        const articleCommentResDto = await this.#repos.articleCommentRepo.save(userId, articleId, content);
        return articleCommentResDto;

    }

    async getArticleComments(articleId: string) {
        const articleCommentResDtos = await this.#repos.articleCommentRepo.findArticleComments(articleId);
        return articleCommentResDtos;
    }

    async deleteArticleComments(commentId: string) {
        await this.#repos.articleCommentRepo.deleteArticleComment(commentId);
    }

    async updateArticleComment(dto: ArticleCommentRequest) {
        const { articleId, commentId, content, userId } = dto;
        if (!commentId) {
            throw new Error('Comment ID is required for updating a comment.');
        }


        const articleCommentResDto = await this.#repos.articleCommentRepo.update(userId, articleId, commentId, content);

        return articleCommentResDto;
    }

}