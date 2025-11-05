import { PersistedCommentEntity } from "../../../03-domain/entity/comment.entity";
import { BaseCommentResDto } from "./base.comment.res.dto";

export class GetCommentListResDto {
  public comments;

  constructor(comments: PersistedCommentEntity[]) {
    this.comments = comments.map((comment) => (
      new BaseCommentResDto(comment)
    ));
  }
}
