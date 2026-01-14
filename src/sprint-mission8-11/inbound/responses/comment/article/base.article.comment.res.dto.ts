import { PersitstArticleCommentEntity } from "../../../../application/command/entity/comment/article-comment.entity";

export class BaseArticleCommentResDto {
  public id: number;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(entity: PersitstArticleCommentEntity) {
    this.id = entity.id;
    this.content = entity.content;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
