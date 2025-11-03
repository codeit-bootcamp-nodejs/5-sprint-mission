import { Product } from "@prisma/client";
import {
  PersistedProductEntity,
  ProductEntity,
} from "../../domain/entity/proudct-entity";

export class ProductMapper {
  static toPersistent(entity: ProductEntity) {
    return {
      name: entity.name,
      description: entity.description,
      price: entity.price,
      tags: entity.tags,
      images: entity.images,
      userId: entity.userId,
    };
  }

  static toEntity(product: Product) {
    return new ProductEntity({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      images: product.images ?? undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }) as PersistedProductEntity;
  }
}
