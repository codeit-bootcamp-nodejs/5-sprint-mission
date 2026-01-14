import { PersitstArticleCommentEntity } from "../../../../application/command/entity/comment/article-comment.entity";
import { BaseArticleCommentResDto } from "./base.article.comment.res.dto";

export class UpdateArticleCommentResDto extends BaseArticleCommentResDto {
  constructor(updateComment: PersitstArticleCommentEntity) {
    super(updateComment);
  }
}
