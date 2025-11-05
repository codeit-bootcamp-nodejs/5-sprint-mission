import { ArticleComment, ProductComment } from "@prisma/client";
import { CommentEntity, PersistedCommentEntity } from "../../03-domain/entity/comment.entity";

export class CommentMapper {
  static toEntity(comment: ArticleComment | ProductComment) : PersistedCommentEntity {
    return new CommentEntity({
      id: comment.id,
      articleId: "articleId" in comment ? comment.articleId : undefined,
      productId: "productId" in comment ? comment.productId: undefined,
      userId: comment.userId,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }) as PersistedCommentEntity ;
  }
  static toPersistent(entity: CommentEntity) {
    return {
      content: entity.content,
    };
  }
}
