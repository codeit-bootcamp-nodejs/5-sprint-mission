import { IServices } from "../domain/service/services";
import { BaseController, ControllerHandler } from "./base.controller";
import { createProductCommentReqSchema, deleteProductCommentReqSchema, getProductCommentReqSchema, updateProductCommentReqSchema } from "../requests/product/product.req.schemas";
import { CreateCommentResDto } from "../responses/comment/create.comment.res.dto";
import { DeleteCommentResDto } from "../responses/comment/delete.comment.res.dto";
import { GetCommentListResDto } from "../responses/comment/get.comment.list.res.dto";
import { UpdateCommentResDto } from "../responses/comment/update.comment.res.dto";

export class ProductCommentController extends BaseController {

  constructor(services: IServices) {
    super(services);
  }

  createProductCommentController: ControllerHandler = async (req, res, next) => {
    const resDto = this.validateOrThrow(createProductCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
      ...req.body
    }))
    const createdComment =
      await this._commentService.createComment(resDto);
    const createdCommentResDto = new CreateCommentResDto(createdComment);
    return res.json(createdCommentResDto);
  };

  getProductCommentListController: ControllerHandler = async (req, res, next) => {
    const resDto = this.validateOrThrow(getProductCommentReqSchema.safeParse({
      ...req.query,
      ...req.params
    }));

    const getCommentList =
      await this._commentService.getCommentList(resDto);
    const getCommentListResDto = new GetCommentListResDto(getCommentList);
    return res.json(getCommentListResDto);
  };

  updateProductCommentController: ControllerHandler = async (req, res, next) => {
    const resDto = this.validateOrThrow(updateProductCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.body,
      ...req.params
    }));
    const updatedComment =
      await this._commentService.updateComment(resDto);
    const updatedCommentResDto = new UpdateCommentResDto(updatedComment);
    return res.json(updatedCommentResDto);
  };

  deleteProductCommentController: ControllerHandler = async (req, res, next) => {
    const resDto = this.validateOrThrow(deleteProductCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params
    }));
      await this._commentService.deleteComment(resDto);
    const deletedCommentResDto = new DeleteCommentResDto();
    return res.json(deletedCommentResDto);
  };
}
