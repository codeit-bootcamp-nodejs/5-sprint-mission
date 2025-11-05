import { Request, Response } from "express";
import { IService } from "../../03-domain/I.service";
import { Authenticator, HttpError } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { articleCommentSchema } from "../req-validator/req.validator";






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
        const result = articleCommentSchema.safeParse({
            body: req.body,
            params: req.params,
            user: req.user
        })

        if (result.success) {
            console.log(result.data);
            const articleCommentResDto = await this.#service.articleCommentService.createArticleComment(result.data);
            return res.json(articleCommentResDto);
        } else {
            throw new HttpError("Invalid article Comment Request", 400);
        }
    }


    getArticleComments = async (req: Request, res: Response) => {
        const articleId = req.params.articleId;
        const comments = await this.#service.articleCommentService.getArticleComments(articleId);
        return res.json(comments);
    }


    modifyArticleComment = async (req: Request, res: Response) => {

        const result = articleCommentSchema.safeParse({
            body: req.body,
            params: req.params,
            user: req.user
        })

        if (result.success) {
            const articleCommentResDto = await this.#service.articleCommentService.updateArticleComment(result.data);
            return res.json(articleCommentResDto);
        } else {
            throw new HttpError("Invalid article Comment Request", 400);
        }
    }


    deleteArticleComment = async (req: Request, res: Response) => {
        const commentId = req.params.commentId;
        await this.#service.articleCommentService.deleteArticleComments(commentId);
        return res.status(200).json();
    }
}