import { QueryType } from "../../../01-inbound/request/req.validator";
import { NewArticle, PersistedArticle } from "../../entity/article";

export interface IArticleRepository {
  save(entity: NewArticle): Promise<PersistedArticle>;

  findAll(query: QueryType): Promise<PersistedArticle[]>;

  findById(id: string): Promise<PersistedArticle>;

  update(
    foundEntity: PersistedArticle,
    newEntity: NewArticle,
  ): Promise<PersistedArticle>;

  remove(id: string): void;
}
