import { PersistProductEntity } from "../../../application/command/entity/product/product.entity";

export class UserLikeProductsResDto {
  public products;

  constructor(likeProducts: PersistProductEntity[]) {
    this.products = likeProducts.map((product) => ({
      ownerId: product.userId,
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      imags: product.images,
    }));
  }
}
