import { PersitstProductCommentEntity } from "../../../../domain/entity/comment/product-comment.entity";

export class BaseProductCommentResDto {
  public id: number;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(entity: PersitstProductCommentEntity) {
    this.id = entity.id;
    this.content = entity.content;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
