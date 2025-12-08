import { Request, Response } from "express";
import { Authenticator, HttpError } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { articleCommentBodySchema, articleCommentParamSchema } from "../request/req.validator";
import { IService } from "../port/i.service";






export class ArticleCommentController extends BaseController {
    #service
    #auth

    constructor(service: IService, auth: Authenticator) {
        super('/article')
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        // article Comments
        this.router.post('/:articleId/comments', this.#auth.verifyAccessToken, this.createArticleComment);
        this.router.get('/:articleId/comments', this.getArticleComments);
        this.router.patch('/:articleId/comments/:commentId', this.#auth.verifyAccessToken, this.modifyArticleComment);
        this.router.delete('/:articleId/comments/:commentId', this.#auth.verifyAccessToken, this.deleteArticleComment);
    }



    createArticleComment = async (req: Request, res: Response) => {
        const body = this.validate(articleCommentBodySchema, req.body);
        const params = this.validate(articleCommentParamSchema, req.params);

        const articleCommentResDto = await this.#service.articleCommentService.createArticleComment({
            ...body,
            ...params,
            userId: req.user.userId
        });
        return res.json(articleCommentResDto);
    }



    getArticleComments = async (req: Request, res: Response) => {
        const articleId = req.params.articleId;
        const comments = await this.#service.articleCommentService.getArticleComments(articleId);
        return res.json(comments);
    }


    modifyArticleComment = async (req: Request, res: Response) => {
        const body = this.validate(articleCommentBodySchema, req.body);
        const params = this.validate(articleCommentParamSchema, req.params);

        const articleCommentResDto = await this.#service.articleCommentService.updateArticleComment({
            ...body,
            ...params,
            userId: req.user.userId
        });
        return res.json(articleCommentResDto);
    }


    deleteArticleComment = async (req: Request, res: Response) => {
        const commentId = req.params.commentId;
        await this.#service.articleCommentService.deleteArticleComments(commentId);
        return res.status(200).json();
    }
}