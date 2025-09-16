import { CreateCommentReqValidator } from "../req.validator/comment/create.comment.req.validator.js";
import { DeleteCommentReqValidator } from "../req.validator/comment/delete.comment.req.validator.js";
import { UpdateCommentReqValidator } from "../req.validator/comment/update.comment.req.validator.js";
import { ViewCommentListReqValidator } from "../req.validator/comment/view.comment.list.req.validator.js";
import { CreateCommentResDto } from "../res.dto/comment/create.comment.res.dto.js";
import { DeleteCommentResDto } from "../res.dto/comment/delete.comment.res.dto.js";
import { UpdateCommentResDto } from "../res.dto/comment/update.comment.res.dto.js";
import { ViewCommentListResDto } from "../res.dto/comment/view.comment.list.res.dto.js";

export class CommentMiddleware{
  #commentService;

  constructor(commentService){
    this.#commentService = commentService;
  }

  createCommentMiddleware = async (req, res, next) => {
      const createCommentReqDto = new CreateCommentReqValidator({ body: req.body }).validate();
      const createdComment = await this.#commentService.createComment(createCommentReqDto);
      const createdCommentResDto = new CreateCommentResDto(createdComment);
      return res.json(createdCommentResDto);
    };

    viewCommentListMiddleware = async (req, res, next) => {
      const viewCommentListReqDto = new ViewCommentListReqValidator({ query: req.query }).validate();
      const viewCommentList = await this.#commentService.viewCommentList(viewCommentListReqDto);
      const viewCommentListResDto = new ViewCommentListResDto(viewCommentList);
      return res.json(viewCommentListResDto);
    };
  
    updateCommentMiddleware = async (req, res, next) => {
      const updateCommentReqDto = new UpdateCommentReqValidator({ body: req.body }).validate();
      const updatedComment = await this.#commentService.updateComment(updateCommentReqDto);
      const updatedCommentResDto = new UpdateCommentResDto(updatedComment);
      return res.json(updatedCommentResDto);
    };
  
    deleteCommentMiddleware = async (req, res, next) => {
      const deleteCommentReqDto = new DeleteCommentReqValidator({ body: req.body }).validate();
      const deletedwComment = await this.#commentService.deleteComment(deleteCommentReqDto);
      const deletedCommentResDto = new DeleteCommentResDto(deletedwComment);
      return res.json(deletedCommentResDto);
    };
}