import { BaseController, ControllerHandler } from "./base.controller";
import { createArticleCommentReqSchema, deleteArticleCommentReqSchema, getArticleCommentReqSchema, updateArticleCommentReqSchema } from "../requests/article/article.req.schemas";
import { IServices } from "../port/services.interface";
import { CreateArticleCommentResDto } from "../responses/comment/article/create.article.comment.res.dto";
import { GetArticleCommentListResDto } from "../responses/comment/article/get.article.comment.list.res.dto";
import { UpdateArticleCommentResDto } from "../responses/comment/article/update.article.comment.res.dto";
import { DeleteArticleCommentResDto } from "../responses/comment/article/delete.article.comment.res.dto";

export class ArticleCommentController extends BaseController {

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
      await this._services.articleComment.createComment(reqDto);
    const createdCommentResDto = new CreateArticleCommentResDto(createdComment);
    return res.json(createdCommentResDto);
  };

  getArticleCommentListController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(getArticleCommentReqSchema.safeParse({
      ...req.params,
      ...req.query
    }));
    const getCommentList =
      await this._services.articleComment.getCommentList(reqDto);
    const getCommentListResDto = new GetArticleCommentListResDto(getCommentList);
    return res.json(getCommentListResDto);
  };

  updateArticleCommentController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(updateArticleCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
      ...req.body
    }));
    const updatedComment =
      await this._services.articleComment.updateComment(reqDto);
    const updatedCommentResDto = new UpdateArticleCommentResDto(updatedComment);
    return res.json(updatedCommentResDto);
  };

  deleteArticleCommentController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(deleteArticleCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));
    await this._services.articleComment.deleteComment(reqDto);
    const deletedCommentResDto = new DeleteArticleCommentResDto();
    return res.json(deletedCommentResDto);
  };
}
