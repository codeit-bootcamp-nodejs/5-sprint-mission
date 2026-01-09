import { CommentKeys, Sort } from "../../../../../types/query";
import { PersitstArticleCommentEntity, NewArticleCommentEntity } from "../../../../command/entity/comment/article-comment.entity";

export interface IArticleCommentCommandRepo {
  findCommentById(id: number): Promise<PersitstArticleCommentEntity | null>;
  findCommentList(
    articleId: string,
    cursor: number,
    limit: number,
    orderBy: { field: CommentKeys; sort: Sort },
  ): Promise<PersitstArticleCommentEntity[] | null>;
  create(
    entity: NewArticleCommentEntity,
  ): Promise<PersitstArticleCommentEntity>;
  update(
    entity: PersitstArticleCommentEntity,
  ): Promise<PersitstArticleCommentEntity>;
  delete(commentId: number): Promise<void>;
  count(articleId: string): Promise<number>;
}
