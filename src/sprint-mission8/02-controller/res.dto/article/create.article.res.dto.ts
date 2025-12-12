import { PersistedArticleEntity } from "../../../03-domain/entity/article.entity";
import { BaseArticleResDto } from "./base.article.res.dto";

export class CreateArticleResDto extends BaseArticleResDto {
  constructor(createArticle: PersistedArticleEntity) {
    super(createArticle)
  }
}
