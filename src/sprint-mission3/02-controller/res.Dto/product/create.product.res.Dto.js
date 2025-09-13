export class CreateProductResDto{
  constructor(createProduct) {
    this.id = createProduct.id;
    this.name = createProduct.name;
    this.description = createProduct.description;
    this.price = createProduct.price;
    this.tags = createProduct.tags;
    this.createdAt = createProduct.createdAt;
    this.updatedAt = createProduct.updatedAt;
  }
}