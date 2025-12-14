import { PersistedProductEntity } from "../../../domain/entity/product/product.entity";

export class BaseProductResDto {
  public id: string;
  public name: string;
  public description: string;
  public price: number;
  public tags: string[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(entity: PersistedProductEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.price = entity.price;
    this.tags = entity.tags;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}