import { ArticleReqDto, QueryType } from "../../../01-inbound/request/req.validator"
import { Article } from "../../entity/article"

export interface IArticleRepository {

    findAll(query: QueryType): Promise<Article[]>

    findById(id: string): Promise<Article>

    save(dto: ArticleReqDto): Promise<Article>

    updateById(entity: ArticleReqDto): Promise<Article>

    deleteById(id: string): void
}
