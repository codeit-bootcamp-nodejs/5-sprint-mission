import { PersistProductEntity } from "../../../application/command/entity/product/product.entity";

export class UserProductsResDto {
  public products;

  constructor(products: PersistProductEntity[]) {
    this.products = products.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      imags: product.images,
    }));
  }
}
