import { Product, ProductLike } from "@prisma/client";
import { PersistedProductEntity, ProductEntity, } from "../../03-domain/entity/product.entity";

interface ProductWithLike extends Product {
  ProductLike?: ProductLike[];
}

export class ProductMapper {
  static toEntity(product: ProductWithLike): PersistedProductEntity {
    return new ProductEntity({
      id: product.id,
      userId: product.userId,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      isLiked: product.ProductLike?.[0]?.isLiked ?? false,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }) as PersistedProductEntity;
  }
  static toPersistent(entity: ProductEntity) {
    return {
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      tags: entity.tags,
    };
  }
  static toPersistentForCreate(entity: PersistedProductEntity) {
    return {
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      tags: entity.tags,
    };
  }
}
