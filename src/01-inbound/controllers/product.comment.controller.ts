import { Request, Response } from "express";
import { Authenticator } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { productCommentBodySchema, productCommentParamSchema } from "../request/req.validator";
import { ProductCommentService } from "../../02-domain/service/product.comment.service";






export class ProductCommentController extends BaseController {
    #service
    #auth

    constructor(service: ProductCommentService, auth: Authenticator) {
        super('/product')
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        // 상품 댓글 생성   
        this.router.post(
            '/:productId/comments',
            this.#auth.verifyAccessToken,
            this.createProductComment
        );

        // 상품 댓글 조회
        this.router.get(
            '/:productId/comments',
            this.getProductComments
        );

        // 상품 댓글 수정
        this.router.patch(
            '/:productId/comments/:commentId',
            this.#auth.verifyAccessToken,
            this.modifyProductComment
        );

        // 상품 댓글 삭제
        this.router.delete(
            '/:productId/comments/:commentId',
            this.#auth.verifyAccessToken,
            this.deleteProductComment
        );
    }



    createProductComment = async (req: Request, res: Response) => {
        const body = this.validate(productCommentBodySchema, req.body);
        const params = this.validate(productCommentParamSchema, req.params);

        const productCommentResDto = await this.#service.createProductComment({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.json(productCommentResDto);
    }


    getProductComments = async (req: Request, res: Response) => {
        const productId = req.params.productId;
        const comments = await this.#service.getProductComments(productId);
        return res.json(comments);
    }


    modifyProductComment = async (req: Request, res: Response) => {
        const body = this.validate(productCommentBodySchema, req.body);
        const params = this.validate(productCommentParamSchema, req.params);

        const productCommentResDto = await this.#service.updateProductComment({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.json(productCommentResDto);
    }


    deleteProductComment = async (req: Request, res: Response) => {
        const commentId = req.params.commentId;
        await this.#service.deleteProductComments(commentId);
        return res.status(200).json();
    }
}