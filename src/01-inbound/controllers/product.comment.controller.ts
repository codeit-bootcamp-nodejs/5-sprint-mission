import { Request, Response } from "express";
import { AuthenticatorType } from "../../external/authenticator";
import { BaseController } from "./base.controller"; //
import { ProductCommentServiceType } from "../../02-domain/service/product.comment.service";
import {
  productCommentBodySchema,
  productCommentParamSchema,
} from "../request/product.comment.request";

export const createProductCommentController = (
  service: ProductCommentServiceType,
  auth: AuthenticatorType,
) => {
  const { basePath, router, validate, errorHandler } =
    BaseController("/product");

  const registerRoutes = () => {
    // 상품 댓글 생성
    router.post(
      "/:productId/comments",
      errorHandler(auth.verifyAccessToken),
      errorHandler(createProductComment),
    );

    // 상품 댓글 조회
    router.get("/:productId/comments", errorHandler(getProductComments));

    // 상품 댓글 수정
    router.patch(
      "/:productId/comments/:commentId",
      errorHandler(auth.verifyAccessToken),
      errorHandler(modifyProductComment),
    );

    // 상품 댓글 삭제
    router.delete(
      "/:productId/comments/:commentId",
      errorHandler(auth.verifyAccessToken),
      errorHandler(deleteProductComment),
    );
  };

  const createProductComment = async (req: Request, res: Response) => {
    const body = validate(productCommentBodySchema, req.body);
    const params = validate(productCommentParamSchema, req.params);

    const productCommentResDto = await service.createProductComment({
      ...body,
      ...params,
      userId: req.user.userId,
    });

    return res.json(productCommentResDto);
  };

  const getProductComments = async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const comments = await service.getProductComments(productId);
    return res.json(comments);
  };

  const modifyProductComment = async (req: Request, res: Response) => {
    const body = validate(productCommentBodySchema, req.body);
    const params = validate(productCommentParamSchema, req.params);

    const productCommentResDto = await service.updateProductComment({
      ...body,
      ...params,
      userId: req.user.userId,
    });

    return res.json(productCommentResDto);
  };

  const deleteProductComment = async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    await service.deleteProductComments(commentId);
    return res.status(200).json();
  };

  registerRoutes();

  return {
    basePath,
    router,
  };
};
