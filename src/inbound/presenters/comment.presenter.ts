import { Comment } from "../../domain/entities/comment.entity";

export class CommentPresenter {
  toResponse(comment: Comment) {
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      articleId: comment.articleId,
      productId: comment.productId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  toCursorListResponse(comments: Comment[], nextCursor: number | null) {
    return {
      list: comments.map((comment) => this.toResponse(comment)),
      nextCursor,
    };
  }

  toCreateResponse(comment: Comment) {
    return this.toResponse(comment);
  }

  toDeleteResponse(id: number) {
    return { id };
  }
}
