import { PersistedCommentEntity } from "../../domain/entity/comment-entity";
import { EditCommentDto, UploadArticleCommentDto, UploadProductCommentDto } from "../../dto/comments/comment.dto";
import { PaginationQuery } from "../../repositories/repository";

export interface ICommentRepository {
  uploadProductComment(data: UploadProductCommentDto): Promise<PersistedCommentEntity>;
  uploadArticleComment(data: UploadArticleCommentDto): Promise<PersistedCommentEntity>;
  loadDetail(commentId: number): Promise<PersistedCommentEntity | null>;
  editComment(commentId: number, data: EditCommentDto): Promise<PersistedCommentEntity>;
  deleteComment(commentId: number): Promise<void>;
  loadProductComments(
    productId: number,
    query: PaginationQuery,
  ): Promise<PersistedCommentEntity[]>;
  loadArticleComments(
    articleId: number,
    query: PaginationQuery,
  ): Promise<PersistedCommentEntity[]>;
}
