import { PersistArticleEntity } from "../../../application/command/entity/article.entity";

export class BaseArticleResDto {
  public id: string;
  public title: string;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(entity: PersistArticleEntity) {
    this.id = entity.id;
    this.title = entity.title;
    this.content = entity.content;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
