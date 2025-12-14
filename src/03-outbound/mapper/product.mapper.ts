import { PersistedProduct, Product } from "../../02-domain/entity/product";
import { PersistProduct } from "../repository/product.repository";

export const ProductMapper = {
  toPersist: (product: PersistProduct): PersistedProduct => {
    return Product.createPersist({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      userId: product.userId,
      imageUrl: product.imageUrl ?? undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      likeCount: product.likeCount,
    }) as PersistedProduct;
  },
};
