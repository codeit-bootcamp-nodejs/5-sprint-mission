import { PersitstArticleCommentEntity } from "../../../../domain/entity/comment/article-comment.entity";
import {
  CreateArticleCommentDto,
  DeleteArticleCommentDto,
  GetArticleCommentDto,
  UpdateArticleCommentDto,
} from "../../../requests/article/article.req.schemas";

export interface IArticleCommentService {
  getCommentList(
    dto: GetArticleCommentDto,
  ): Promise<PersitstArticleCommentEntity[]>;
  createComment(
    dto: CreateArticleCommentDto,
  ): Promise<PersitstArticleCommentEntity>;
  updateComment(
    dto: UpdateArticleCommentDto,
  ): Promise<PersitstArticleCommentEntity>;
  deleteComment(dto: DeleteArticleCommentDto): Promise<void>;
}
