import { ProductCommentResDto } from "../../../01-inbound/response/product.comment.res.dto";

export interface IProductCommentRepository {
    save(userId: string, productId: string, content: string): Promise<ProductCommentResDto>
    findProductComments(productId: string): Promise<ProductCommentResDto[]>;
    deleteProductComment(commentId: string): void;
    update(userId: string, productId: string, commentId: string, content: string): Promise<ProductCommentResDto>
}
