import { ProductEntity } from "../../../03-domain/entity/product.entity";

export class UserLikeProductsResDto {
  public products;
  
  constructor(likeProducts: ProductEntity[]) {
    this.products = likeProducts.map((product) => ({
      ownerId: product.userId,
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      isLiked: product.isLiked,
    }));
  }
}
