import { Request, Response } from "express";
import { Authenticator } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { articleCommentBodySchema, articleCommentParamSchema } from "../request/req.validator";
import { ArticleCommentService } from "../../02-domain/service/article.comment.service";






export class ArticleCommentController extends BaseController {
    #service
    #auth

    constructor(service: ArticleCommentService, auth: Authenticator) {
        super('/article')
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        // 댓글 작성
        this.router.post(
            '/:articleId/comments',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.createArticleComment)
        );

        // 댓글 조회
        this.router.get(
            '/:articleId/comments',
            this.catch(this.getArticleComments)
        );

        // 댓글 수정
        this.router.patch(
            '/:articleId/comments/:commentId',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.modifyArticleComment)
        );

        // 댓글 삭제
        this.router.delete(
            '/:articleId/comments/:commentId',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.deleteArticleComment)
        );
    }



    createArticleComment = async (req: Request, res: Response) => {
        const body = this.validate(articleCommentBodySchema, req.body);
        const params = this.validate(articleCommentParamSchema, req.params);

        const articleCommentResDto = await this.#service.createArticleComment({
            ...body,
            ...params,
            userId: req.user.userId
        });
        return res.json(articleCommentResDto);
    }



    getArticleComments = async (req: Request, res: Response) => {
        const articleId = req.params.articleId;
        const comments = await this.#service.getArticleComments(articleId);
        return res.json(comments);
    }


    modifyArticleComment = async (req: Request, res: Response) => {
        const body = this.validate(articleCommentBodySchema, req.body);
        const params = this.validate(articleCommentParamSchema, req.params);

        const articleCommentResDto = await this.#service.updateArticleComment({
            ...body,
            ...params,
            userId: req.user.userId
        });
        return res.json(articleCommentResDto);
    }


    deleteArticleComment = async (req: Request, res: Response) => {
        const commentId = req.params.commentId;
        const articleId = req.params.articleId;
        const userId = req.user.userId;
        await this.#service.deleteArticleComments(articleId, commentId, userId);
        return res.status(200).json();
    }
}