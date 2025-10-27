import { Exception } from "../../common/exception.js";
import { Comment } from "../entity/comment.js";

export class CommentService {
  #commentRepo;

  constructor(commentRepo) {
    this.#commentRepo = commentRepo;
  }

  viewCommentList = async ({ targetType, cursor, limit, sort }) => {
    const orderBy =
      sort === "recent" ? { updatedAt: "desc" } : { content: "asc" };

    if (limit > 20) {
      throw new Exception("LIMIT_MAX_20");
    }

    const commentTotalCount = await this.#commentRepo.count();
    if (commentTotalCount < limit) {
      throw new Exception("LIMIT_OVERFLOW", { totalCount: commentTotalCount });
    }

    const foundCommentList = await this.#commentRepo.findCommentList({
      targetType,
      cursor,
      limit,
      orderBy,
    });

    return foundCommentList;
  };

  createComment = async ({ targetId, content }) => {
    const foundProduct = await this.#commentRepo.findProductById(targetId);
    const foundArticle = await this.#commentRepo.findArticleById(targetId);
    if (!foundProduct && !foundArticle) {
      throw new Exception("ID_NOT_EXSIST");
    }

    const entity = Comment.factory({ targetId, content });
    let targetType;
    if (foundProduct) targetType = "product";
    else if (foundArticle) targetType = "article";

    const createdComment = await this.#commentRepo.create({
      targetType,
      entity,
    });

    return createdComment;
  };

  updateComment = async ({ id, content }) => {
    const foundComment = await this.#commentRepo.findCommentById(id);
    if (!foundComment) {
      throw new Exception("COMMENT_NOT_EXIST");
    }

    const comment = Comment.factory({ id, content });

    const updatedComment = await this.#commentRepo.update(comment);

    return updatedComment;
  };

  deleteComment = async ({ id }) => {
    const foundComment = await this.#commentRepo.findCommentById(id);

    if (!foundComment) {
      throw new Exception("COMMENT_NOT_EXIST");
    }
    const deletedComment = await this.#commentRepo.delete(id);
    return deletedComment;
  };
}
