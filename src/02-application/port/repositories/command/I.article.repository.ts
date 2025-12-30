import { QueryType } from "../../../../01-inbound/request/query.request";
import { NewArticle, PersistedArticle } from "../../../command/entity/article";

export interface IArticleCommandRepository {
  save(entity: NewArticle): Promise<PersistedArticle>;

  findAll(query: QueryType): Promise<PersistedArticle[]>;

  findById(id: string): Promise<PersistedArticle>;

  update(
    foundEntity: PersistedArticle,
    newEntity: NewArticle,
  ): Promise<PersistedArticle>;

  remove(id: string): void;
}
