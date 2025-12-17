import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { AuthenticatorType } from "../../external/authenticator";
import { ArticleServiceType } from "../../02-domain/service/article.service";
import {
  articleBodySchema,
  articleParamSchema,
} from "../request/article.request";
import { querySchema } from "../request/query.request";

export const createArticleController = (
  _service: ArticleServiceType,
  _auth: AuthenticatorType,
) => {
  const { basePath, router, validate, errorHandler } =
    BaseController("/articles");
  const service = _service;
  const auth = _auth;

  const registerRoutes = () => {
    // 글 작성
    router.post(
      "/",
      errorHandler(auth.verifyAccessToken),
      errorHandler(createArticle),
    );

    // 특정 글 조회
    router.get("/:id", errorHandler(getArticle));

    // 모든 글 조회
    router.get("/", errorHandler(getArticles));

    // 글 수정
    router.patch(
      "/:id",
      errorHandler(auth.verifyAccessToken),
      errorHandler(updateArticle),
    );

    // 글 삭제
    router.delete(
      "/:id",
      errorHandler(auth.verifyAccessToken),
      errorHandler(deleteArticle),
    );
  };

  const createArticle = async (req: Request, res: Response) => {
    const body = validate(articleBodySchema, req.body);
    const params = validate(articleParamSchema, req.params);

    const articleResDto = await service.createArticle({
      ...body,
      ...params,
      userId: req.user.userId,
    });

    return res.status(201).json(articleResDto);
  };

  const getArticle = async (req: Request, res: Response) => {
    const id = req.params.id;
    const articleResDto = await service.getArticle(id);
    return res.json(articleResDto);
  };

  const getArticles = async (req: Request, res: Response) => {
    const articleReqDto = validate(querySchema, req.query);
    const articlesResDtos = await service.getAllArticles(articleReqDto);
    return res.json(articlesResDtos);
  };

  const updateArticle = async (req: Request, res: Response) => {
    const body = validate(articleBodySchema, req.body);
    const params = validate(articleParamSchema, req.params);

    const articleResDto = await service.updateArticle({
      ...body,
      ...params,
      userId: req.user.userId,
    });
    return res.status(200).json(articleResDto);
  };

  const deleteArticle = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.user.userId;
    await service.deleteArticle(id, userId);
    res.status(200).json();
  };

  registerRoutes();

  return {
    basePath,
    router,
  };
};
