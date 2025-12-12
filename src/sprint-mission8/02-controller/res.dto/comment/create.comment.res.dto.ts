import { PersistedCommentEntity } from "../../../03-domain/entity/comment.entity";
import { BaseCommentResDto } from "./base.comment.res.dto";

export class CreateCommentResDto extends BaseCommentResDto {
  constructor(createComment: PersistedCommentEntity) {
    super(createComment)
  }
}
