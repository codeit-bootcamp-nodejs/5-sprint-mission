import { CreateArticleCommentReqValidator } from "./req.validator/comment/article/create.article.comment.req.validator.js";
import { DeleteArticleCommentReqValidator } from "./req.validator/comment/article/delete.article.comment.req.validator.js";
import { UpdateArticleCommentReqValidator } from "./req.validator/comment/article/update.article.comment.req.validator.js";
import { GeteArticleCommentListReqValidator } from "./req.validator/comment/article/get.article.comment.list.req.validator.js";
import { CreateCommentResDto } from "./res.dto/comment/create.comment.res.dto.js";
import { DeleteCommentResDto } from "./res.dto/comment/delete.comment.res.dto.js";
import { UpdateCommentResDto } from "./res.dto/comment/update.comment.res.dto.js";
import { GetCommentListResDto } from "./res.dto/comment/get.comment.list.res.dto.js";

export class ArticleCommentController {
  #services;

  constructor(services) {
    this.#services = services;
  }

  createArticleCommentController = async (req, res, next) => {
    const createCommentReqDto = new CreateArticleCommentReqValidator({
      body: req.body,
      params: req.params,
      userId: req.userId,
    }).validate();
    const createdComment =
      await this.#services.comment.createComment(createCommentReqDto);
    const createdCommentResDto = new CreateCommentResDto(createdComment);
    return res.json(createdCommentResDto);
  };

  getArticleCommentListController = async (req, res, next) => {
    const getCommentListReqDto = new GeteArticleCommentListReqValidator({
      query: req.query,
      params: req.params,
    }).validate();
    const getCommentList = await this.#services.comment.getCommentList(
      getCommentListReqDto,
    );
    const getCommentListResDto = new GetCommentListResDto(getCommentList);
    return res.json(getCommentListResDto);
  };

  updateArticleCommentController = async (req, res, next) => {
    const updateCommentReqDto = new UpdateArticleCommentReqValidator({
      body: req.body,
      params: req.params,
      userId: req.userId,
    }).validate();
    const updatedComment =
      await this.#services.comment.updateComment(updateCommentReqDto);
    const updatedCommentResDto = new UpdateCommentResDto(updatedComment);
    return res.json(updatedCommentResDto);
  };

  deleteArticleCommentController = async (req, res, next) => {
    const deleteCommentReqDto = new DeleteArticleCommentReqValidator({
      params: req.params,
      userId: req.userId,
    }).validate();
    const deletedwComment =
      await this.#services.comment.deleteComment(deleteCommentReqDto);
    const deletedCommentResDto = new DeleteCommentResDto(deletedwComment);
    return res.json(deletedCommentResDto);
  };
}
