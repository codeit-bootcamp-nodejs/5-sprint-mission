import { ProductEntity } from "../../domain/entity/proudct-entity";

export const mapProduct = (product: ProductEntity) => ({
  id: product.id,
  userId: product.userId,
  name: product.name,
  description: product.description,
  price: product.price,
  tags: product.tags,
  image: product.image,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});
