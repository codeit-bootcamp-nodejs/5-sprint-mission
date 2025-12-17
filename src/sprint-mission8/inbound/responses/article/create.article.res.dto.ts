import { PersistArticleEntity } from "../../../domain/entity/article.entity";
import { BaseArticleResDto } from "./base.article.res.dto";

export class CreateArticleResDto extends BaseArticleResDto {
  constructor(createArticle: PersistArticleEntity) {
    super(createArticle)
  }
}
