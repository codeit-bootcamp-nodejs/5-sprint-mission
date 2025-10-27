export class GetProductResDto {
  constructor(getProduct) {
    this.id = getProduct.id;
    this.name = getProduct.name;
    this.description = getProduct.description;
    this.price = getProduct.price;
    this.tags = getProduct.tags;
    this.createdAt = getProduct.createdAt;
    this.updatedAt = getProduct.updatedAt;
  }
}
