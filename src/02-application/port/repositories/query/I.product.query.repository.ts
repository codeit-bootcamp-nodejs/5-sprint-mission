import { QueryType } from "../../../../01-inbound/request/query.request";
import { ArticleResDto } from "../../../../01-inbound/response/article.response";
import { ArticleView } from "../../../query/view/article.view";
import { ProductView } from "../../../query/view/product.view";

export interface IProductQueryRepository {
    findAll(query: QueryType): Promise<ProductView[]>;
    findById(id: string): Promise<ProductView>;
}