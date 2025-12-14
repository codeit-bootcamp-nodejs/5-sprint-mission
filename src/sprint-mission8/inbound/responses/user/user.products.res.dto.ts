import { ProductEntity } from "../../../domain/entity/product/product.entity";
import { PersistedUserEntity } from "../../../domain/entity/user.entity";

export class UserProductsResDto {
  public email;
  public products;

  constructor({ user, products }: {
    user : PersistedUserEntity;
    products : ProductEntity[];
  }) {
    this.email = user.email;
    this.products = products.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
    }));
  }
}
