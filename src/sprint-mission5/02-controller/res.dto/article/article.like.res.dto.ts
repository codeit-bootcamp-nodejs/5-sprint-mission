import { PersistedArticleEntity } from "../../../03-domain/entity/article.entity";
import { BaseArticleResDto } from "./base.article.res.dto";

export class ArticleLikeResDto extends BaseArticleResDto {
  public ownerId;
  public isLiked;

  constructor(getArticle: PersistedArticleEntity) {
    super(getArticle);
    this.ownerId = getArticle.userId;
    this.isLiked = getArticle.isLiked;
  }
}
