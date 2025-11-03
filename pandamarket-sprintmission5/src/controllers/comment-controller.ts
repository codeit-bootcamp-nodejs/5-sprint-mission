import { IService } from "../domain/service";
import BadRequestError from "../lib/errors/BadRequestError";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";
import { IdParamsStruct } from "../structs/common-structs";
import { UpdateCommentBodyStruct } from "../structs/comments-struct";
import { create } from "superstruct";

export interface ICommentController {
  handlerCreateProductComment: (req: Request, res: Response) => Promise<void>;
  handlerCreateArticleComment: (req: Request, res: Response) => Promise<void>;
  handlerUpdateComment: (req: Request, res: Response) => Promise<void>;
  handlerDeleteComment: (req: Request, res: Response) => Promise<void>;
  handlerGetProductComments: (req: Request, res: Response) => Promise<void>;
  handlerGetArticleComments: (req: Request, res: Response) => Promise<void>;
} 

export class CommentController extends BaseController implements ICommentController {
  constructor(service: IService) {
    super(service)
  }

  handlerCreateProductComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const { id } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, UpdateCommentBodyStruct);

    const comment = await this.service.comment.createProductComment(
      id,
      userId,
      content
    );
    res.status(201).json(comment);
  };

  handlerCreateArticleComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, UpdateCommentBodyStruct);

    const comment = await this.service.comment.createArticleComment(
      id,
      userId,
      content,
    );
    res.status(201).json(comment);
  };

  handlerUpdateComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
    const updatedComment = await this.service.comment.updateComment(
      id,
      userId,
      content,
    );
    res.status(200).json(updatedComment)
  };

  handlerDeleteComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
     const { id } = create(req.params, IdParamsStruct);
    await this.service.comment.deleteComment(id, userId);
    res.status(200).json({ message: "댓글이 삭제되었습니다" });
  };

  handlerGetProductComments = async (req: Request, res: Response) => {
    const { id } = create(req.params, IdParamsStruct);
    const query = req.query;
    const result = await this.service.comment.getProductComments(
      id,
      query,
    );
    res.json(result);
  };

  handlerGetArticleComments = async (req: Request, res: Response) => {
    const { id } = create(req.params, IdParamsStruct);
    const query = req.query;
    const result = await this.service.comment.getArticleComments(
      id,
      query,
    );
    res.json(result);
  };
}
