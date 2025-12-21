import { ProductCommentView } from "../../../query/view/product.comment.view";

export interface IProductCommentQueryRepository {
    findAll(id: string): Promise<ProductCommentView[]>;
}