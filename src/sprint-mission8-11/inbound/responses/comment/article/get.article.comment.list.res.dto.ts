import { PersitstArticleCommentEntity } from "../../../../application/command/entity/comment/article-comment.entity";
import { BaseArticleCommentResDto } from "./base.article.comment.res.dto";

export class GetArticleCommentListResDto {
  public comments;

  constructor(comments: PersitstArticleCommentEntity[]) {
    this.comments = comments.map(
      (comment) => new BaseArticleCommentResDto(comment),
    );
  }
}
