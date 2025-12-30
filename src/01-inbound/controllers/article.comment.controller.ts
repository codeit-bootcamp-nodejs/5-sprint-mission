import { Request, Response } from "express";
import { BaseController } from "./base.controller"; //
import {
  articleCommentBodySchema,
  articleCommentParamSchema,
} from "../request/article.comment.request";
import { AuthenticatorType } from "../../shared/authenticator/authenticator";
import { ArticleCommentCommandServiceType } from "../../02-application/command/service/article.comment.command.service";
import { ArticleCommentQueryServiceType } from "../../02-application/query/service/article.comment.query.service";

export const createArticleCommentController = (
  _articleCommentCommandService: ArticleCommentCommandServiceType,
  _articleCommentQueryService: ArticleCommentQueryServiceType,
  _auth: AuthenticatorType,
) => {
  const { basePath, router, validate, errorHandler } =
    BaseController("/article");
  const articleCommentCommandService = _articleCommentCommandService;
  const articleCommentQueryService = _articleCommentQueryService;
  const auth = _auth;

  const registerRoutes = () => {
    router.post(
      "/:articleId/comments",
      errorHandler(auth.verifyAccessToken),
      errorHandler(createArticleComment),
    );

    // 댓글 조회
    router.get("/:articleId/comments", errorHandler(getArticleComments));

    // 댓글 수정
    router.patch(
      "/:articleId/comments/:commentId",
      errorHandler(auth.verifyAccessToken),
      errorHandler(modifyArticleComment),
    );

    // 댓글 삭제
    router.delete(
      "/:articleId/comments/:commentId",
      errorHandler(auth.verifyAccessToken),
      errorHandler(deleteArticleComment),
    );
  };

  const createArticleComment = async (req: Request, res: Response) => {
    const body = validate(articleCommentBodySchema, req.body);
    const params = validate(articleCommentParamSchema, req.params);

    const articleCommentResDto =
      await articleCommentCommandService.createArticleComment({
        ...body,
        ...params,
        userId: req.user.userId,
      });
    return res.status(201).json(articleCommentResDto);
  };

  const getArticleComments = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;
    const comments =
      await articleCommentQueryService.getArticleComments(articleId);
    return res.json(comments);
  };

  const modifyArticleComment = async (req: Request, res: Response) => {
    const body = validate(articleCommentBodySchema, req.body);
    const params = validate(articleCommentParamSchema, req.params);

    const articleCommentResDto =
      await articleCommentCommandService.updateArticleComment({
        ...body,
        ...params,
        userId: req.user.userId,
      });
    return res.json(articleCommentResDto);
  };

  const deleteArticleComment = async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    const articleId = req.params.articleId;
    const userId = req.user.userId;
    await articleCommentCommandService.deleteArticleComments(
      articleId,
      commentId,
      userId,
    );
    return res.status(200).json();
  };

  registerRoutes();
  return {
    basePath,
    router,
  };
};
