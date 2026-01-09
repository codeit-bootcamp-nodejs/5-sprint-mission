import { PersistArticleEntity } from "../../../application/command/entity/article.entity";
import { IArticleQueryRepo } from "../../../application/port/repo/query/article.query.repo.interface";
import { BaseRepo } from "../base.repo";

export class ArticleQueryRepo extends BaseRepo implements IArticleQueryRepo{

  findUserLikeArticles(userId: string, offset: number, limit: number): Promise<PersistArticleEntity[] | null> {
    throw new Error("Method not implemented.");
  }

}