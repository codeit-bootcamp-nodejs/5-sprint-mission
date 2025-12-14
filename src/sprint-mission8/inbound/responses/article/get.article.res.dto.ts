import { PersistedArticleEntity } from "../../../domain/entity/article.entity";
import { BaseArticleResDto } from "./base.article.res.dto";

export class GetArticleResDto extends BaseArticleResDto {
  constructor(getArticle: PersistedArticleEntity) {
    super(getArticle);
  }
}
