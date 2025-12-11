import { NewProductComment, PersistedProductComment } from "../../entity/product.comment.entity";

export interface IProductCommentRepository {
    save(entity: NewProductComment): Promise<PersistedProductComment>
    findProductComments(productId: string): Promise<PersistedProductComment[]>;
    findProductComment(commentId: string): Promise<PersistedProductComment>;
    deleteProductComment(commentId: string): void;
    update(foundEntity: PersistedProductComment, newEntity: NewProductComment): Promise<PersistedProductComment>
}
