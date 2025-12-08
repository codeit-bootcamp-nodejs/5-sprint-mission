import { ArticleCommentRequest } from "../../02-controller/req-validator/req.validator";
import { ArticleCommentResDto } from "../../02-controller/res-dto/article.comment.res.dto";
import { IBaseRepository } from "../../04-repository/I.base.repository";
import { Authenticator } from "../../external/authenticator";






export interface IArticleCommentService {
    createArticleComment(dto: ArticleCommentRequest): Promise<ArticleCommentResDto>
    getArticleComments(articleId: string): Promise<ArticleCommentResDto[]>;
    deleteArticleComments(commentId: string): void;
    updateArticleComment(dto: ArticleCommentRequest): Promise<ArticleCommentResDto>
}

export class ArticleCommentService implements IArticleCommentService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }




    async createArticleComment(dto: ArticleCommentRequest) {
        const { articleId, userId, content } = dto;

        console.log(userId);

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