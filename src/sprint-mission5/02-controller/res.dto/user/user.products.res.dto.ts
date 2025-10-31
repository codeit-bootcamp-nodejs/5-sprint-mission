import { ProductEntity } from "../../../03-domain/entity/product.entity";
import { PersistedUserEntity } from "../../../03-domain/entity/user.entity";

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
