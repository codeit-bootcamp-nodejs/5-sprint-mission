import { CommentEntity } from "../../domain/entity/comment-entity";

export const mapComment = (comment: CommentEntity) => ({
  id: comment.id,
  userId: comment.userId,
  productId: comment.productId ?? null,
  articleId: comment.articleId ?? null,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});
