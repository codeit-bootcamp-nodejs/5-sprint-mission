import { IServices } from "../domain/service/services";
import { BaseController, ControllerHandler } from "./base.controller";
import { createArticleCommentReqSchema, deleteArticleCommentReqSchema, getArticleCommentReqSchema, updateArticleCommentReqSchema } from "./req.validator/article/article.req.schemas";
import { CreateCommentResDto } from "./res.dto/comment/create.comment.res.dto";
import { DeleteCommentResDto } from "./res.dto/comment/delete.comment.res.dto";
import { GetCommentListResDto } from "./res.dto/comment/get.comment.list.res.dto";
import { UpdateCommentResDto } from "./res.dto/comment/update.comment.res.dto";

export interface IArticleCommentController {
  createArticleCommentController: ControllerHandler;
  getArticleCommentListController: ControllerHandler;
  updateArticleCommentController: ControllerHandler;
  deleteArticleCommentController: ControllerHandler;
}

export class ArticleCommentController extends BaseController implements IArticleCommentController {

  constructor(services: IServices) {
    super(services);
  }

  createArticleCommentController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(createArticleCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
      ...req.body
    }));
    const createdComment =
      await this._commentService.createComment(reqDto);
    const createdCommentResDto = new CreateCommentResDto(createdComment);
    return res.json(createdCommentResDto);
  };

  getArticleCommentListController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(getArticleCommentReqSchema.safeParse({
      ...req.params,
      ...req.query
    }));
    const getCommentList =
      await this._commentService.getCommentList(reqDto);
    const getCommentListResDto = new GetCommentListResDto(getCommentList);
    return res.json(getCommentListResDto);
  };

  updateArticleCommentController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(updateArticleCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
      ...req.body
    }));
    const updatedComment =
      await this._commentService.updateComment(reqDto);
    const updatedCommentResDto = new UpdateCommentResDto(updatedComment);
    return res.json(updatedCommentResDto);
  };

  deleteArticleCommentController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(deleteArticleCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));
    await this._commentService.deleteComment(reqDto);
    const deletedCommentResDto = new DeleteCommentResDto();
    return res.json(deletedCommentResDto);
  };
}
