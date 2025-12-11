import { Request, Response } from "express";
import { Authenticator } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { productCommentBodySchema, productCommentParamSchema } from "../request/req.validator";
import { ProductCommentService } from "../../02-domain/service/product.comment.service";






export const ProductCommentController = (service: ProductCommentService, auth: Authenticator) => {
    const { basePath, router, validate, errorHandler } = BaseController('/product');



    const registerRoutes = () => {
        // 상품 댓글 생성   
        router.post(
            '/:productId/comments',
            auth.verifyAccessToken,
            createProductComment
        );

        // 상품 댓글 조회
        router.get(
            '/:productId/comments',
            getProductComments
        );

        // 상품 댓글 수정
        router.patch(
            '/:productId/comments/:commentId',
            #auth.verifyAccessToken,
            modifyProductComment
        );

        // 상품 댓글 삭제
        router.delete(
            '/:productId/comments/:commentId',
            #auth.verifyAccessToken,
            deleteProductComment
        );
    }



    const createProductComment = async (req: Request, res: Response) => {
        const body = validate(productCommentBodySchema, req.body);
        const params = validate(productCommentParamSchema, req.params);

        const productCommentResDto = await service.createProductComment({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.json(productCommentResDto);
    }


    const getProductComments = async (req: Request, res: Response) => {
        const productId = req.params.productId;
        const comments = await service.getProductComments(productId);
        return res.json(comments);
    }


    const modifyProductComment = async (req: Request, res: Response) => {
        const body = validate(productCommentBodySchema, req.body);
        const params = validate(productCommentParamSchema, req.params);

        const productCommentResDto = await service.updateProductComment({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.json(productCommentResDto);
    }


    const deleteProductComment = async (req: Request, res: Response) => {
        const commentId = req.params.commentId;
        await service.deleteProductComments(commentId);
        return res.status(200).json();
    }

    registerRoutes();

    return {
        basePath,
        router
    };
}