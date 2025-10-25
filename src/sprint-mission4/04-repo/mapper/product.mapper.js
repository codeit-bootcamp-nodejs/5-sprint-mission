import { Product } from "../../03-domain/entity/product.js";

export class ProductMapper {
  static toEntity(record) {
    return new Product({
      id: record.id,
      userId: record.userId,
      name: record.name,
      description: record.description,
      price: record.price,
      tags: record.tags,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  static toEntityLike(record) {
    return new Product({
      id: record.product.id,
      userId: record.product.userId,
      name: record.product.name,
      description: record.product.description,
      price: record.product.price,
      tags: record.product.tags,
      isLiked: record.isLiked,
      createdAt: record.product.createdAt,
      updatedAt: record.product.updatedAt,
    });
  }
  static toPersistent(entity) {
    return {
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      tags: entity.tags,
    };
  }
}
