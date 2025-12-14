import { PersitstProductCommentEntity } from "../../../../domain/entity/comment/product-comment.entity";
import { BaseProductCommentResDto } from "./base.product.comment.res.dto";

export class UpdateProductCommentResDto extends BaseProductCommentResDto {
  constructor(updateComment: PersitstProductCommentEntity) {
    super(updateComment);
  }
}
