import { ProductCommentRequest } from "../../request/req.validator";
import { ProductCommentResDto } from "../../response/product.comment.res.dto";

export interface IProductCommentService {
    createProductComment(dto: ProductCommentRequest): Promise<ProductCommentResDto>
    getProductComments(productId: string): Promise<ProductCommentResDto[]>;
    deleteProductComments(commentId: string): void;
    updateProductComment(dto: ProductCommentRequest): Promise<ProductCommentResDto>
}
