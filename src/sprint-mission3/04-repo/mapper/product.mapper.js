import { Product } from "../../03-domain/entity/product.js";

export class ProductMapper {
  static toEntity(record) {
    return new Product({
      id: record.id,
      name: record.name,
      description: record.description,
      price: record.price,
      tags: record.tags,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  static toPersistent(entity) {
    return {
      name: entity.name,
      description: entity.description,
      price: entity.price,
      tags: entity.tags,
    };
  }
}
