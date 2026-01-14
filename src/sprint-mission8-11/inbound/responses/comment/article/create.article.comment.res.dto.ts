import { PersitstArticleCommentEntity } from "../../../../application/command/entity/comment/article-comment.entity";
import { BaseArticleCommentResDto } from "./base.article.comment.res.dto";

export class CreateArticleCommentResDto extends BaseArticleCommentResDto {
  constructor(createComment: PersitstArticleCommentEntity) {
    super(createComment);
  }
}
