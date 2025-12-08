import { Request, Response } from "express";
import { IService } from "../../03-domain/I.service";
import { Authenticator, HttpError } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { productCommentBodySchema, productCommentParamSchema } from "../req-validator/req.validator";
import { ProductCommentResDto } from "../res-dto/product.comment.res.dto";






export class ProductCommentController extends BaseController {
    #service
    #auth

    constructor(service: IService, auth: Authenticator) {
        super('/product')
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        // Product Comments
        this.router.post('/:productId/comments', this.#auth.verifyAccessToken, this.createProductComment);
        this.router.get('/:productId/comments', this.getProductComments);
        this.router.patch('/:productId/comments/:commentId', this.#auth.verifyAccessToken, this.modifyProductComment);
        this.router.delete('/:productId/comments/:commentId', this.#auth.verifyAccessToken, this.deleteProductComment);
    }



    createProductComment = async (req: Request, res: Response) => {
        const body = this.validate(productCommentBodySchema, req.body);
        const params = this.validate(productCommentParamSchema, req.params);

        const productCommentResDto = await this.#service.productCommentService.createProductComment({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.json(productCommentResDto);
    }


    getProductComments = async (req: Request, res: Response) => {
        const productId = req.params.productId;
        const comments = await this.#service.productCommentService.getProductComments(productId);
        return res.json(comments);
    }


    modifyProductComment = async (req: Request, res: Response) => {
        const body = this.validate(productCommentBodySchema, req.body);
        const params = this.validate(productCommentParamSchema, req.params);

        const productCommentResDto = await this.#service.productCommentService.updateProductComment({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.json(productCommentResDto);
    }


    deleteProductComment = async (req: Request, res: Response) => {
        const commentId = req.params.commentId;
        await this.#service.productCommentService.deleteProductComments(commentId);
        return res.status(200).json();
    }
}