export class UserProductsResDto {
  email;
  products;

  constructor({ user, products }) {
    this.email = user.email;
    this.products = products.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
    }));
  }
}
