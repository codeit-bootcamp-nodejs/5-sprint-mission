import { Request, Response } from "express";
import { AuthenticatorType } from "../../shared/authenticator/authenticator";
import { BaseController } from "./base.controller"; //
import {
  productCommentBodySchema,
  productCommentParamSchema,
} from "../request/product.comment.request";
import { ProductCommentQueryServiceType } from "../../02-application/query/service/product.comment.query.service";
import { ProductCommentCommandServiceType } from "../../02-application/command/service/product.comment.command.service";


export const createProductCommentController = (
  productCommentCommandService: ProductCommentCommandServiceType,
  productCommentQueryService: ProductCommentQueryServiceType,
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

    const productCommentResDto = await productCommentCommandService.createProductComment({
      ...body,
      ...params,
      userId: req.user.userId,
    });

    return res.status(201).json(productCommentResDto);
  };

  const getProductComments = async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const comments = await productCommentQueryService.getProductComments(productId);
    return res.json(comments);
  };

  const modifyProductComment = async (req: Request, res: Response) => {
    const body = validate(productCommentBodySchema, req.body);
    const params = validate(productCommentParamSchema, req.params);

    const productCommentResDto = await productCommentCommandService.updateProductComment({
      ...body,
      ...params,
      userId: req.user.userId,
    });

    return res.json(productCommentResDto);
  };

  const deleteProductComment = async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    await productCommentCommandService.deleteProductComments(commentId);
    return res.status(200).json();
  };

  registerRoutes();

  return {
    basePath,
    router,
  };
};
