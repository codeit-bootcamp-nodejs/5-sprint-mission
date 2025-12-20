import { ProductCommentService } from "../../domain/service/product/product-comment.service";
import { createProductCommentReqSchema, deleteProductCommentReqSchema, getProductCommentReqSchema, updateProductCommentReqSchema } from "../requests/product/product.req.schemas";
import { CreateProductCommentResDto } from "../responses/comment/product/create.product.comment.res.dto";
import { DeleteProductCommentResDto } from "../responses/comment/product/delete.product.comment.res.dto";
import { GetProductCommentListResDto } from "../responses/comment/product/get.product.comment.list.res.dto";
import { UpdateProductCommentResDto } from "../responses/comment/product/update.product.comment.res.dto";
import { BaseController, ControllerHandler } from "./base.controller";

export class ProductCommentController extends BaseController {
  
  constructor(
    private readonly _productCommentService: ProductCommentService
  ) {
    super();
  }

  createProductCommentController: ControllerHandler = async (req, res, next) => {
    const resDto = this.validateOrThrow(createProductCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
      ...req.body
    }))
    const createdComment =
      await this._productCommentService.createComment(resDto);
    const createdCommentResDto = new CreateProductCommentResDto(createdComment);
    return res.json(createdCommentResDto);
  };

  getProductCommentListController: ControllerHandler = async (req, res, next) => {
    const resDto = this.validateOrThrow(getProductCommentReqSchema.safeParse({
      ...req.query,
      ...req.params
    }));

    const getCommentList =
      await this._productCommentService.getCommentList(resDto);
    const getCommentListResDto = new GetProductCommentListResDto(getCommentList);
    return res.json(getCommentListResDto);
  };

  updateProductCommentController: ControllerHandler = async (req, res, next) => {
    const resDto = this.validateOrThrow(updateProductCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.body,
      ...req.params
    }));
    const updatedComment =
      await this._productCommentService.updateComment(resDto);
    const updatedCommentResDto = new UpdateProductCommentResDto(updatedComment);
    return res.json(updatedCommentResDto);
  };

  deleteProductCommentController: ControllerHandler = async (req, res, next) => {
    const resDto = this.validateOrThrow(deleteProductCommentReqSchema.safeParse({
      userId: req.userId,
      ...req.params
    }));
    await this._productCommentService.deleteComment(resDto);
    const deletedCommentResDto = new DeleteProductCommentResDto();
    return res.json(deletedCommentResDto);
  };
}
