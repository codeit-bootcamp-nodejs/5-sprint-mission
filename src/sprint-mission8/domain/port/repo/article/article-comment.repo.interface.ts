import { CommentKeys, Sort } from "../../../../types/query";
import { NewArticleCommentEntity, PersitstArticleCommentEntity } from "../../../entity/comment/article-comment.entity";

export interface IArticleCommentRepo {
  findCommentById(id: number): Promise<PersitstArticleCommentEntity | null>;
  findCommentList(
    articleId: string,
    cursor: number,
    limit: number,
    orderBy: { field: CommentKeys, sort: Sort }): Promise<PersitstArticleCommentEntity[] | null>;
  create(entity: NewArticleCommentEntity): Promise<PersitstArticleCommentEntity>;
  update(entity: PersitstArticleCommentEntity): Promise<PersitstArticleCommentEntity>;
  delete(commentId: number): Promise<void>;
  count(articleId: string): Promise<number>
}