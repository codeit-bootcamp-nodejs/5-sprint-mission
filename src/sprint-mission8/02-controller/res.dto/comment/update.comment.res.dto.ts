import { PersistedCommentEntity } from "../../../domain/entity/comment/comment.entity";
import { BaseCommentResDto } from "./base.comment.res.dto";

export class UpdateCommentResDto extends BaseCommentResDto {
  constructor(updateComment: PersistedCommentEntity) {
    super(updateComment);
  }
}
