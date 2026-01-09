import { PersitstProductCommentEntity } from "../../../../application/command/entity/comment/product-comment.entity";
import { BaseProductCommentResDto } from "./base.product.comment.res.dto";

export class GetProductCommentListResDto {
  public comments;

  constructor(comments: PersitstProductCommentEntity[]) {
    this.comments = comments.map(
      (comment) => new BaseProductCommentResDto(comment),
    );
  }
}
