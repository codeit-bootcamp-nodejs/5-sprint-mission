import { NewProductComment, PersistedProductComment } from "../../../command/entity/product.comment.entity";



export interface IProductCommentCommandRepository {
  save(
    entity: NewProductComment,
  ): Promise<PersistedProductComment>;

  findAll(
    productId: string,
  ): Promise<PersistedProductComment[]>;

  findById(commentId: string): Promise<PersistedProductComment>;

  remove(commentId: string): void;

  update(
    foundEntity: PersistedProductComment,
    newEntity: NewProductComment,
  ): Promise<PersistedProductComment>;
}
