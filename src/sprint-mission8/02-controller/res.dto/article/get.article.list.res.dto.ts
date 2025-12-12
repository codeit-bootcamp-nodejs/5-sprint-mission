import { PersistedArticleEntity } from "../../../03-domain/entity/article.entity";
import { BaseArticleResDto } from "./base.article.res.dto";

export class GetArticleListResDto {
  public articles;

  constructor(articles: PersistedArticleEntity[]) {
    this.articles = articles.map((article) => (
      new BaseArticleResDto(article)
    ));
  }
}
