import { Comment } from "@prisma/client";
import { CommentEntity, PersistedCommentEntity, CommentParams } from "../../domain/entity/comment-entity";
import { UploadArticleCommentDto, UploadProductCommentDto } from "../../dto/comments/comment.dto";

export class CommentMapper {
  
  static toPersistent(
    data: UploadProductCommentDto | UploadArticleCommentDto 
  ) {
    return {
      content: data.content,
      userId: data.userId,
      productId: (data as UploadProductCommentDto).productId,
      articleId: (data as UploadArticleCommentDto).articleId,
    }
  }

  static toEntity(comment: Comment) {
    return new CommentEntity({
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      productId: comment.productId,
      articleId: comment.articleId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }) as PersistedCommentEntity;
  }
}
