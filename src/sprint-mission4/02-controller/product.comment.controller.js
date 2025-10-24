import { CreateProductCommentReqValidator } from "./req.validator/comment/product/create.product.comment.req.validator.js";
import { DeleteProductCommentReqValidator } from "./req.validator/comment/product/delete.product.comment.req.validator.js";
import { UpdateProductCommentReqValidator } from "./req.validator/comment/product/update.product.comment.req.validator.js";
import { GetProductCommentListReqValidator } from "./req.validator/comment/product/get.product.comment.list.req.validator.js";
import { CreateCommentResDto } from "./res.dto/comment/create.comment.res.dto.js";
import { DeleteCommentResDto } from "./res.dto/comment/delete.comment.res.dto.js";
import { UpdateCommentResDto } from "./res.dto/comment/update.comment.res.dto.js";
import { GetCommentListResDto } from "./res.dto/comment/get.comment.list.res.dto.js";

export class ProductCommentController {
  #services;

  constructor(services) {
    this.#services = services;
  }

  createProductCommentController = async (req, res, next) => {
    const createCommentReqDto = new CreateProductCommentReqValidator({
      body: req.body,
      params: req.params,
      userId: req.userId,
    }).validate();
    const createdComment =
      await this.#services.comment.createComment(createCommentReqDto);
    const createdCommentResDto = new CreateCommentResDto(createdComment);
    return res.json(createdCommentResDto);
  };

  getProductCommentListController = async (req, res, next) => {
    const getCommentListReqDto = new GetProductCommentListReqValidator({
      query: req.query,
      params: req.params
    }).validate();
    const getCommentList = await this.#services.comment.getCommentList(
      getCommentListReqDto,
    );
    const getCommentListResDto = new GetCommentListResDto(getCommentList);
    return res.json(getCommentListResDto);
  };

  updateProductCommentController = async (req, res, next) => {
    const updateCommentReqDto = new UpdateProductCommentReqValidator({
      body: req.body,
      params: req.params,
      userId: req.userId,
    }).validate();
    const updatedComment =
      await this.#services.comment.updateComment(updateCommentReqDto);
    const updatedCommentResDto = new UpdateCommentResDto(updatedComment);
    return res.json(updatedCommentResDto);
  };

  deleteProductCommentController = async (req, res, next) => {
    const deleteCommentReqDto = new DeleteProductCommentReqValidator({
      params: req.params,
      userId: req.userId,
    }).validate();
    const deletedwComment =
      await this.#services.comment.deleteComment(deleteCommentReqDto);
    const deletedCommentResDto = new DeleteCommentResDto(deletedwComment);
    return res.json(deletedCommentResDto);
  };
}
