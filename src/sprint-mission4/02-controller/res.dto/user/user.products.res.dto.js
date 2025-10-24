export class UserProductsResDto {
  email;
  products;
  name;
  description;
  price;
  tags;
  constructor({ user, products }) {
    this.email = user.email;
    this.products = [
      products.map(product => {
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.tags = product.tags;
      })
    ]
  }
}