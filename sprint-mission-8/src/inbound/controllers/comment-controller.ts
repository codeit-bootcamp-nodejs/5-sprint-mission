import { BaseController } from "./base-controller";
import { Request, Response } from "express";
import {
  ArticleIdParamsStruct,
  IdParamsStruct,
  ProductIdParamsStruct,
} from "../structs/common-structs";
import {
  CreateCommentBodyStruct,
  UpdateCommentBodyStruct,
} from "../structs/comments-struct";
import { IService } from "../../domain/service";
import { ICommentController } from "../controller";
import { Middlewares } from "../middlewares";
import { IConfigUtil } from "../../shared/config";
import { mapComment } from "../mappers/comment-mapper";
import { emitNotificationToUser } from "../ws/ws-emitter";

export class CommentController
  extends BaseController
  implements ICommentController
{
  constructor(
    middlewares: Middlewares,
    service: IService,
    configUtils: IConfigUtil,
  ) {
    super("/", middlewares, service, configUtils);
    this.register();
  }

  register() {
    this.router.post(
      "/product/:productId/comment",
      this.middlewares.auth({ optional: false }),
      this.catch(this.createProductComment),
    );

    this.router.post(
      "/article/:articleId/comment",
      this.middlewares.auth({ optional: false }),
      this.catch(this.createArticleComment),
    );

    this.router.patch(
      "/comment/:id",
      this.middlewares.auth({ optional: false }),
      this.catch(this.updateComment),
    );

    this.router.delete(
      "/comment/:id",
      this.middlewares.auth({ optional: false }),
      this.catch(this.deleteComment),
    );

    this.router.get(
      "/product/:productId/comments",
      this.middlewares.auth({ optional: true }),
      this.catch(this.getProductComments),
    );

    this.router.get(
      "/article/:articleId/comments",
      this.middlewares.auth({ optional: true }),
      this.catch(this.getArticleComments),
    );
  }

  createProductComment = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { productId } = this.validate(ProductIdParamsStruct, req.params);
    const { content } = this.validate(CreateCommentBodyStruct, req.body);

    const comment = await this.service.comment.createProductComment(
      productId,
      userId,
      content,
    );
    res.status(201).json(mapComment(comment));
  };

  createArticleComment = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { articleId } = this.validate(ArticleIdParamsStruct, req.params);
    const { content } = this.validate(CreateCommentBodyStruct, req.body);

    const { comment, notification } =
      await this.service.comment.createArticleComment(
        articleId,
        userId,
        content,
      );

    if (notification) {
      emitNotificationToUser(notification.userId!, notification);
    }

    res.status(201).json({
      comment: mapComment(comment),
      notification,
    });
  };

  updateComment = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = this.validate(IdParamsStruct, req.params);
    const { content } = this.validate(UpdateCommentBodyStruct, req.body);
    const updatedComment = await this.service.comment.updateComment(
      id,
      userId,
      content,
    );
    res.status(200).json(mapComment(updatedComment));
  };

  deleteComment = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { articleId } = this.validate(ArticleIdParamsStruct, req.params);
    await this.service.comment.deleteComment(articleId, userId);
    res.status(200).json({ message: "댓글이 삭제되었습니다" });
  };

  getProductComments = async (req: Request, res: Response) => {
    const { articleId } = this.validate(ArticleIdParamsStruct, req.params);
    const query = req.query;
    const result = await this.service.comment.getProductComments(
      articleId,
      query,
    );
    res.json(result.map(mapComment));
  };

  getArticleComments = async (req: Request, res: Response) => {
    const { articleId } = this.validate(ArticleIdParamsStruct, req.params);
    const query = req.query;
    const result = await this.service.comment.getArticleComments(
      articleId,
      query,
    );
    res.json(result.map(mapComment));
  };
}
