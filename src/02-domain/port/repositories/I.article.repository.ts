import { ArticleReqDto, QueryType } from "../../../01-inbound/request/req.validator"
import { Article, NewArticleEntity, PersistArticleEntity } from "../../entity/article"

export interface IArticleRepository {

    findAll(query: QueryType): Promise<PersistArticleEntity[]>

    findById(id: string): Promise<PersistArticleEntity>

    save(entity: NewArticleEntity): Promise<PersistArticleEntity>

    updateArticle(foundEntity: PersistArticleEntity, newEntity: NewArticleEntity): Promise<PersistArticleEntity>

    deleteById(id: string): void
}
