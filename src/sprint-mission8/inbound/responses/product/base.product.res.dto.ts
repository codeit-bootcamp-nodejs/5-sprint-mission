import { ProductImageVo } from "../../../domain/entity/product/product-image.vo";
import { ProductTagVo } from "../../../domain/entity/product/product-tag.vo";
import { PersistProductEntity } from "../../../domain/entity/product/product.entity";

export class BaseProductResDto {
  public id: string;
  public name: string;
  public description: string;
  public price: number;
  public tags: ProductTagVo[];
  public image: ProductImageVo[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(entity: PersistProductEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.price = entity.price;
    this.tags = entity.tags;
    this.image = entity.images;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}