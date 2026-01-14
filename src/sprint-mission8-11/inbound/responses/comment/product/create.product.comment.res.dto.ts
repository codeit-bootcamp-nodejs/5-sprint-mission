import { PersitstProductCommentEntity } from "../../../../application/command/entity/comment/product-comment.entity";
import { BaseProductCommentResDto } from "./base.product.comment.res.dto";

export class CreateProductCommentResDto extends BaseProductCommentResDto {
  constructor(createComment: PersitstProductCommentEntity) {
    super(createComment);
  }
}
