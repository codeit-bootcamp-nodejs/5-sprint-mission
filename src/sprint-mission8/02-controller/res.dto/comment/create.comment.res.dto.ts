import { PersistedCommentEntity } from "../../../domain/entity/comment/comment.entity";
import { BaseCommentResDto } from "./base.comment.res.dto";

export class CreateCommentResDto extends BaseCommentResDto {
  constructor(createComment: PersistedCommentEntity) {
    super(createComment)
  }
}
