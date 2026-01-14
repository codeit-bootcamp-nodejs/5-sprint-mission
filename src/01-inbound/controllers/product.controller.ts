import { Request, Response } from "express";
import {
  productBodySchema,
  productParamSchema,
} from "../request/product.request";
import { querySchema } from "../request/query.request";
import { AuthenticatorType } from "../../shared/authenticator/authenticator";
import { BaseController } from "./base.controller";
import { ProductCommandServiceType } from "../../02-application/command/service/product.command.service";
import { ProductQueryServiceType } from "../../02-application/query/service/product.query.service";

export const createProductController = (
  productCommandService: ProductCommandServiceType,
  productCommentQueryService: ProductQueryServiceType,
  auth: AuthenticatorType,
) => {
  const { basePath, router, validate, errorHandler } =
    BaseController("/products");

  const registerRoutes = () => {
    // 상품 생성
    router.post(
      "/",
      errorHandler(auth.verifyAccessToken),
      errorHandler(createProduct),
    );

    // 상품 조회
    router.get("/", errorHandler(getProducts));

    // 상품 상세 조회
    router.get("/:id", errorHandler(getProduct));

    // 상품 수정
    router.patch(
      "/:id",
      errorHandler(auth.verifyAccessToken),
      errorHandler(updateProduct),
    );

    // 상품 삭제
    router.delete(
      "/:id",
      errorHandler(auth.verifyAccessToken),
      errorHandler(deleteProduct),
    );

    // 상품 좋아요
    router.patch(
      "/:id/likes",
      errorHandler(auth.verifyAccessToken),
      errorHandler(likeProduct),
    );
  };

  const createProduct = async (req: Request, res: Response) => {
    const body = validate(productBodySchema, req.body);
    const params = validate(productParamSchema, req.params);
    const newProductResDto = await productCommandService.createProduct({
      ...body,
      ...params,
      userId: req.user.userId,
    });

    return res.status(201).json(newProductResDto);
  };

  const getProducts = async (req: Request, res: Response) => {
    const query = validate(querySchema, req.query);
    const productsResDto =
      await productCommentQueryService.getAllProducts(query);
    return res.json(productsResDto);
  };

  const getProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const productResDto = await productCommentQueryService.getProduct(id);
    return res.json(productResDto);
  };

  const updateProduct = async (req: Request, res: Response) => {
    const body = validate(productBodySchema, req.body);
    const params = validate(productParamSchema, req.params);
    const query = validate(querySchema, req.query);

    const updatedProductResDto = await productCommandService.updateProduct({
      ...body,
      ...params,
      ...query,
      userId: req.user.userId,
    });
    res.status(201).json(updatedProductResDto);
  };

  const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.user.userId;
    await productCommandService.deleteProduct(id, userId);
    res.status(200).json();
  };

  const likeProduct = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const productId = req.params.id;
    const product = await productCommandService.likeProduct(userId, productId);
    return res.json(product);
  };

  registerRoutes();

  return {
    basePath,
    router,
  };
};
