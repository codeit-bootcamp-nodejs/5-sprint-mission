import { CommentEntity, PersistedCommentEntity } from "../../../domain/entity/comment/comment.entity";

export class BaseCommentResDto {
  public id: number;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(entity: PersistedCommentEntity) {
    this.id = entity.id;
    this.content =entity.content;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}