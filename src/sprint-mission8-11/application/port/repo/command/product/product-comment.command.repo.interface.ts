import { CommentKeys, Sort } from "../../../../../types/query";
import { PersitstProductCommentEntity, NewProductCommentEntity } from "../../../../command/entity/comment/product-comment.entity";

export interface IProductCommentCommandRepo {
  findCommentById(id: number): Promise<PersitstProductCommentEntity | null>;
  findCommentList(
    productId: string,
    cursor: number,
    limit: number,
    orderBy: { field: CommentKeys; sort: Sort },
  ): Promise<PersitstProductCommentEntity[] | null>;
  create(
    entity: NewProductCommentEntity,
  ): Promise<PersitstProductCommentEntity>;
  update(
    entity: PersitstProductCommentEntity,
  ): Promise<PersitstProductCommentEntity>;
  delete(commentId: number): Promise<void>;
  count(productId: string): Promise<number>;
}
