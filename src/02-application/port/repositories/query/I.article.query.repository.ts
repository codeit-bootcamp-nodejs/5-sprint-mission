import { QueryType } from "../../../../01-inbound/request/query.request";
import { ArticleResDto } from "../../../../01-inbound/response/article.response";
import { ArticleView } from "../../../query/view/article.view";

export interface IArticleQueryRepository {
  findAll(query: QueryType): Promise<ArticleView[]>;
  findById(id: string): Promise<ArticleView>;
}
