import { PersistArticleEntity } from "../../../application/command/entity/article.entity";
import { BaseArticleResDto } from "./base.article.res.dto";

export class GetArticleListResDto {
  public articles;

  constructor(articles: PersistArticleEntity[]) {
    this.articles = articles.map((article) => new BaseArticleResDto(article));
  }
}
