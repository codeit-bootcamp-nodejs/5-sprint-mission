import { PersistedArticleEntity } from "../../../domain/entity/article.entity";
import { BaseArticleResDto } from "./base.article.res.dto";

export class UpdateArticleResDto extends BaseArticleResDto {
  constructor(updateArticle: PersistedArticleEntity) {
    super(updateArticle);
  }
}
