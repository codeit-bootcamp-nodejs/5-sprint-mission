export class ViewProductResDto {
  constructor(viewProduct) {
    this.id = viewProduct.id;
    this.name = viewProduct.name;
    this.description = viewProduct.description;
    this.price = viewProduct.price;
    this.tags = viewProduct.tags;
    this.createdAt = viewProduct.createdAt;
    this.updatedAt = viewProduct.updatedAt;
  }
}
