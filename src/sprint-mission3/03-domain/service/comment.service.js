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

  createComment = async ({ targetType, targetId, content }) => {
    const comment = Comment.factory({ targetType, targetId, content });

    const createdComment = await this.#commentRepo.create(comment);

    return createdComment;
  };

  updateComment = async ({ targetType, id, content }) => {
    const foundComment = await this.#commentRepo.findCommentById(id);
    if (!foundComment) {
      throw new Exception("COMMENT_NOT_EXIST");
    }

    const comment = Comment.factory({ targetType, id, content });

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
